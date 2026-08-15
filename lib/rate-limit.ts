/**
 * Fixed-window counters for abuse control.
 *
 * Two backends, chosen at call time:
 *
 * - Upstash Redis over its REST API when `UPSTASH_REDIS_REST_URL` and
 *   `UPSTASH_REDIS_REST_TOKEN` are set. Correct across every serverless
 *   instance, and no npm dependency - it is one fetch.
 * - An in-process Map otherwise. Fine locally and on a single long-lived
 *   server, but each serverless instance keeps its own counts, so the real
 *   ceiling is the configured limit multiplied by the number of warm
 *   instances. It raises the cost of spamming rather than capping it.
 *
 * Fixed windows rather than sliding: a contact form does not need the
 * precision, and one counter per key is one round trip.
 */

export type RateVerdict = {
  allowed: boolean;
  /** Seconds until the window resets. 0 when allowed. */
  retryAfter: number;
};

const ALLOWED: RateVerdict = { allowed: true, retryAfter: 0 };

type Entry = { count: number; resetAt: number };
const memory = new Map<string, Entry>();

/** Keeps the Map from growing without bound on a long-lived server. */
function sweep(now: number) {
  if (memory.size < 5_000) return;
  for (const [key, entry] of memory) {
    if (entry.resetAt <= now) memory.delete(key);
  }
}

function consumeInMemory(
  key: string,
  limit: number,
  windowSeconds: number,
): RateVerdict {
  const now = Date.now();
  sweep(now);

  const entry = memory.get(key);
  if (!entry || entry.resetAt <= now) {
    memory.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return ALLOWED;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  return ALLOWED;
}

type UpstashConfig = { url: string; token: string };

function upstashConfig(): UpstashConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function consumeInRedis(
  config: UpstashConfig,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateVerdict> {
  // INCR then EXPIRE ... NX, so the window starts on the first hit and is not
  // pushed forward by later ones. TTL comes back in the same round trip.
  const response = await fetch(`${config.url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSeconds), "NX"],
      ["TTL", key],
    ]),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`upstash ${response.status}`);

  const results = (await response.json()) as { result: number }[];
  const count = Number(results[0]?.result ?? 0);
  const ttl = Number(results[2]?.result ?? windowSeconds);

  if (count > limit) {
    return { allowed: false, retryAfter: ttl > 0 ? ttl : windowSeconds };
  }
  return ALLOWED;
}

/**
 * Counts one hit against `key`. Never throws - a store that is down must not
 * take the contact form down with it, so a failed check falls back to the
 * in-process counter.
 */
export async function consume(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateVerdict> {
  const config = upstashConfig();
  if (!config) return consumeInMemory(key, limit, windowSeconds);

  try {
    return await consumeInRedis(config, key, limit, windowSeconds);
  } catch (cause) {
    console.error("[rate-limit] store unavailable, falling back:", cause);
    return consumeInMemory(key, limit, windowSeconds);
  }
}

/** True when counts are shared across instances rather than per-process. */
export function isDurable() {
  return upstashConfig() !== null;
}

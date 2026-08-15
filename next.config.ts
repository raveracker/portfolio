import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

/**
 * BotID proxies its detection scripts through this app's own origin, which is
 * what stops ad blockers and third-party script blocking from disabling it.
 * Detection only runs on Vercel; everywhere else `checkBotId()` is a no-op.
 */
export default withBotId(nextConfig);

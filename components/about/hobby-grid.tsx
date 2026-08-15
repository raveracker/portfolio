"use client";

import { Reveal, staggerDelay } from "@/components/site/reveal";
import {
  SpotlightCard,
  SpotlightCardContent,
} from "@/components/ui/spotlight-card";
import type { Hobby } from "@/content/schema";

export function HobbyGrid({ hobbies }: { hobbies: Hobby[] }) {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {hobbies.map((hobby, index) => (
        <Reveal
          as="li"
          key={hobby.slug}
          delay={staggerDelay(index, 0.05, 5)}
          className="h-full"
        >
          <SpotlightCard
            borderRadius={16}
            className="flex h-full flex-col border border-hairline bg-surface transition-colors hover:border-brand/50"
          >
            <SpotlightCardContent className="flex flex-1 flex-col p-6">
              <span aria-hidden className="text-2xl">
                {hobby.emoji}
              </span>
              <h3 className="mt-3 font-medium tracking-tight">{hobby.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {hobby.line}
              </p>
            </SpotlightCardContent>
          </SpotlightCard>
        </Reveal>
      ))}
    </ul>
  );
}

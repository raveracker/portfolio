import { z } from "zod";
import { type Hobby, hobbySchema } from "./schema";

/**
 * Allan's own wording. Drop a photo into /public/hobbies/<slug>.jpg to set
 * `image` on any of these.
 */
export const hobbies: Hobby[] = z.array(hobbySchema).parse([
  {
    slug: "music",
    title: "DJ & Music",
    emoji: "🎧",
    line: "I am a part time DJ and I listen to genres like Hip-Hop, R&B, House and Experimental music.",
  },
  {
    slug: "gaming",
    title: "Gaming",
    emoji: "🎮",
    line: "Dabbling in all sorts of games like RPG, First Person Shooter, and Story Based Games.",
  },
  {
    slug: "reading",
    title: "Reading",
    emoji: "📚",
    line: "From Science Fiction, Self Help, Startups to Dark Fiction. I don't have a specific genre but I am always willing for recommendations.",
  },
  {
    slug: "fitness",
    title: "BJJ (Brazilian Jiu-Jitsu) & Fitness",
    emoji: "🥋",
    line: "Wealth is not good if not in good health, so I do a variety of workouts to keep myself fit and improve focus.",
  },
  {
    slug: "travel",
    title: "Travel",
    emoji: "✈️",
    line: "Not an avid traveller, but I have done some kayaking, paragliding and mountain hiking, plus a few workations. I love being a digital nomad.",
  },
  {
    slug: "cooking",
    title: "Cooking",
    emoji: "🍳",
    line: "My one and only other skill that I have mastered. I love to cook for people because food always touches your heart.",
  },
]);

import { z } from "zod";
import { type Belief, beliefSchema } from "./schema";

/**
 * How Allan works, rather than what he has shipped - the receipts for that
 * live on /work and /projects.
 */
export const beliefs: Belief[] = z.array(beliefSchema).parse([
  {
    slug: "love-the-problem",
    claim: "Love the problem, not the stack.",
    receipt:
      "I want to know who is stuck before I know what I am writing it in. I have picked up plenty of things I did not know for the sake of one project. Knowing a tool well is useful. Being loyal to one gets expensive.",
  },
  {
    slug: "ship-then-learn",
    claim: "Ship it, then learn what you should have known.",
    receipt:
      "I would rather put something rough in front of real people on Friday than hold a perfect plan until Monday. The first version is the question, not the answer. I have been wrong plenty of times this way, just early and cheaply.",
  },
  {
    slug: "give-it-back",
    claim: "The best code I write is the code I do not own.",
    receipt:
      "I publish by default. Writing for someone I will never meet makes me care about things I would happily let slide internally. Some of it comes back better than it went out, and I stop being the only person who knows how it works.",
  },
  {
    slug: "automate-the-boring",
    claim: "If I do it twice, an agent should do it the third time.",
    receipt:
      "Doing the same thing twice genuinely bothers me. The second time round I work out what the pattern is and encode it, so the third time is one command. Not to take people out of the work, but to spend their attention on the part that is genuinely new.",
  },
]);

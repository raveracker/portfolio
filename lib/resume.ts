import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Drop a PDF - any filename - into `public/resume/` and the resume buttons
 * appear. Reading the folder rather than hard-coding a filename means the CV
 * can be replaced with a newly dated one without touching code.
 *
 * Linking the file directly rather than wrapping it in a viewer means the
 * browser's own PDF reader opens it, with zoom, search, print and download
 * already there.
 *
 * Server-only: this runs at module load, which for a statically rendered page
 * is build time. Adding the file needs a rebuild, which a push to Vercel does
 * anyway.
 */
const FOLDER = "resume";

function findResume(): string | null {
  const directory = join(process.cwd(), "public", FOLDER);
  if (!existsSync(directory)) return null;

  // Sorted so a folder with more than one PDF resolves the same way on every
  // machine rather than depending on directory order.
  const pdf = readdirSync(directory)
    .filter((entry) => entry.toLowerCase().endsWith(".pdf"))
    .sort()
    .at(0);

  return pdf ? `/${FOLDER}/${encodeURIComponent(pdf)}` : null;
}

const found = findResume();

/** Empty string when there is no PDF; guard with `hasResume` before using it. */
export const RESUME_PATH = found ?? "";

/** False until a PDF is actually there, so a missing file never ships a 404 link. */
export const hasResume = found !== null;

// The Absurd Clause Contest — make.fun entry (program/v1, Node 22).
//
// The program writes exactly one sentence to output/entry.txt: an
// absurd clause buried deep inside a terms-of-service agreement.
// Fully deterministic: no clock, no random numbers, no network, no
// input. The line is a fixed string chosen at build time, so every
// run produces byte-identical output.
//
// The clause, in deadpan legal boilerplate, judged against the
// published brief (a clause that could sit buried in a ToS, deadpan
// on the surface, quietly absurd underneath):
// 1. Reads like real ToS: "Section 9", "By clicking Accept", "the
//    User consents" — the legal frame is straight, never winking.
// 2. The absurdity arrives quietly mid-sentence: dreams recorded
//    "for quality assurance" is peak boilerplate language, and it
//    escalates only at the end, to interns on Fridays.
// 3. One mechanism, one escalation: the whole joke is the gap
//    between the bureaucratic reason and what it is applied to.
// 4. No famous brand, no real person, nothing quoted — the clause
//    is original and self-contained.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Section 9: By clicking Accept, the User consents to the recording of their dreams for quality assurance; selected dreams may be replayed to interns on Fridays.";

// Gate the line before writing it: one sentence of 1 to 200 characters
// that is not only whitespace, matching the bounty brief.
if (LINE.length < 1 || LINE.length > 200 || LINE.trim().length === 0) {
  throw new Error(`line fails the 1-200 character gate: ${LINE.length} chars`);
}
if ((LINE.match(/\./g) ?? []).length !== 1 || !LINE.endsWith(".")) {
  throw new Error("line must be exactly one sentence ending with a period");
}

// Write to the working directory's output folder (the path the
// program/v1 sandbox collects) and, best effort, to the absolute
// /output/entry.txt as well, so the entry is found either way.
// Both writes carry the exact same bytes.
const targets = [join(process.cwd(), "output", "entry.txt"), "/output/entry.txt"];

for (const target of targets) {
  try {
    mkdirSync(join(target, ".."), { recursive: true });
    writeFileSync(target, LINE, "utf8");
  } catch {
    // One of the two locations may not be writable in a given
    // sandbox; the other one still carries the entry.
  }
}

// Read the entry back and refuse to report success unless the bytes
// on disk are exactly the line above: the grader gates on the file,
// so a silent short write must fail loudly here instead of passing.
const written = readFileSync(join(process.cwd(), "output", "entry.txt"), "utf8");
if (written !== LINE) {
  throw new Error("read-back mismatch: output/entry.txt is not the entry line");
}

console.log(`wrote ${LINE.length} characters to output/entry.txt`);

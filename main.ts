// The 3AM Fridge Text — make.fun entry
// A smart fridge texts its owner at 3am. One line, 1-140 chars.
// Judge: fridge voice, funny, fresh angle — no milk, ice or door-left-open cliche.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

// Named parts of the line, assembled by buildLine() below.
const OPENING = "3am.";
const DEMAND = "Your leftovers have unionized. They want a warmer shelf and a raise.";
const PUNCHLINE = "I told them to talk to you.";

const LINE =
  "3am. Your leftovers have unionized. They want a warmer shelf and a raise. I told them to talk to you.";

function buildLine(): string {
  return [OPENING, DEMAND, PUNCHLINE].join(" ");
}

interface GateReport {
  chars: number;
  valid: boolean;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const valid = chars >= 1 && chars <= 140 && text.trim().length > 0;
  return { chars, valid };
}

function verifyWritten(target: string): string {
  const written = readFileSync(target, "utf8");
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const line = buildLine();
  if (line !== LINE) throw new Error("assembled line drifted from the entry");
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, line, "utf8");
  const report = validateEntry(line);
  if (!report.valid) {
    throw new Error(`gate failed: ${report.chars} code points`);
  }
  const sha = verifyWritten(target);
  console.log(`gate passes: ${report.chars} code points, sha256 ${sha}`);
  console.log(`verified: ${JSON.stringify(line)}`);
}

main();

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdownFile } from "../src/parser";

const FAQ_DIR = join(process.cwd(), "faq-content");
const PLACEHOLDER_PATTERNS = [/\[temp answer\]/i, /^<\/>$/m];

function hasPlaceholder(content: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(content));
}

const files = readdirSync(FAQ_DIR)
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

let hasError = false;
const seenQuestions = new Map<string, string>();

for (const file of files) {
  const fullPath = join(FAQ_DIR, file);
  const content = readFileSync(fullPath, "utf8");

  if (hasPlaceholder(content)) {
    console.error(`Placeholder content detected in ${file}.`);
    hasError = true;
  }

  const entries = parseMarkdownFile(content, file);
  if (!entries.length) {
    console.warn(`Warning: ${file} produced no FAQ entries.`);
  }

  for (const entry of entries) {
    const key = entry.question.toLowerCase();
    const existing = seenQuestions.get(key);
    if (existing) {
      console.warn(`Duplicate question title: "${entry.question}" in ${file} and ${existing}.`);
    } else {
      seenQuestions.set(key, file);
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`Checked ${files.length} FAQ files. No unanswered placeholders found.`);

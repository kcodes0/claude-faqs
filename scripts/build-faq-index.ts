import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { assignSlugs, parseMarkdownFile } from "../src/parser";
import type { FAQCategorySummary, FAQData, FAQEntry } from "../src/types";

const FAQ_DIR = join(process.cwd(), "faq-content");
const OUTPUT_FILE = join(process.cwd(), "faq-index.json");
const HQ_TIMEZONE = "America/Los_Angeles";

function getPacificDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: HQ_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function buildCategoryIndex(entries: FAQEntry[]): FAQCategorySummary[] {
  const categories = new Map<string, FAQCategorySummary>();

  for (const entry of entries) {
    let category = categories.get(entry.category_slug);
    if (!category) {
      category = {
        name: entry.category,
        slug: entry.category_slug,
        count: 0,
        subcategories: [],
      };
      categories.set(entry.category_slug, category);
    }

    category.count += 1;

    let subcategory = category.subcategories.find((item) => item.slug === entry.subcategory_slug);
    if (!subcategory) {
      subcategory = {
        name: entry.subcategory,
        slug: entry.subcategory_slug,
        count: 0,
      };
      category.subcategories.push(subcategory);
    }

    subcategory.count += 1;
  }

  return [...categories.values()]
    .map((category) => ({
      ...category,
      subcategories: category.subcategories.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const markdownFiles = readdirSync(FAQ_DIR)
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => a.localeCompare(b));

const entries: FAQEntry[] = [];
for (const file of markdownFiles) {
  const content = readFileSync(join(FAQ_DIR, file), "utf8");
  entries.push(...parseMarkdownFile(content, file));
}

assignSlugs(entries);

const pacificDate = getPacificDate();
for (const entry of entries) {
  if (!entry.last_verified_at || entry.last_verified_at.toLowerCase() === "auto") {
    entry.last_verified_at = pacificDate;
  }
}

const categoryIndex = buildCategoryIndex(entries);
const data: FAQData = {
  version: "1.0.0",
  generated_at: new Date().toISOString(),
  generated_timezone: HQ_TIMEZONE,
  entry_count: entries.length,
  categories: categoryIndex.map((category) => category.name),
  category_index: categoryIndex,
  category_slugs: Object.fromEntries(categoryIndex.map((category) => [category.slug, category.name])),
  entries,
  slugs: Object.fromEntries(entries.map((entry, index) => [entry.slug, index])),
};

writeFileSync(OUTPUT_FILE, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Built faq-index.json with ${entries.length} entries across ${categoryIndex.length} categories.`);

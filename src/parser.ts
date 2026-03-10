import type { FAQEntry } from "./types";

// Common filler words filtered out during slug generation and tag extraction.
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do",
  "does", "for", "from", "how", "i", "if", "in", "into", "is", "it",
  "my", "of", "on", "or", "our", "should", "so", "that", "the", "their",
  "this", "to", "use", "what", "when", "where", "why", "with", "you", "your",
]);

const ANSWERED_BY_PATTERNS = [
  /^answered by:\s*(.+)$/i,
  /^\*\*answered by:\*\*\s*(.+)$/i,
  /^answered_by:\s*(.+)$/i,
];

const LAST_VERIFIED_PATTERNS = [
  /^last verified:\s*(.+)$/i,
  /^\*\*last verified:\*\*\s*(.+)$/i,
  /^last_verified:\s*(.+)$/i,
];

const SOURCES_PATTERNS = [
  /^sources:\s*(.+)$/i,
  /^\*\*sources:\*\*\s*(.+)$/i,
  /^source_urls:\s*(.+)$/i,
];

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

// Generates a URL-friendly slug from a question string.
export function generateSlug(question: string): string {
  const words = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOP_WORDS.has(word));

  return words.slice(0, 6).join("-") || "untitled";
}

// Extracts keyword tags from the question, subcategory, and answer text.
function extractTags(question: string, subcategory: string, answer: string): string[] {
  const source = `${question} ${subcategory} ${answer.slice(0, 600)}`.toLowerCase();
  const words = source
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 15)
    .map(([word]) => word);
}

function extractUrls(text: string): string[] {
  const urls = new Set<string>();
  const bareUrlPattern = /https?:\/\/[^\s)]+/g;
  const markdownLinkPattern = /\[[^\]]+\]\((https?:\/\/[^)]+)\)/g;

  for (const match of text.matchAll(bareUrlPattern)) {
    urls.add(match[0].replace(/[.,;:]$/, ""));
  }

  for (const match of text.matchAll(markdownLinkPattern)) {
    if (match[1]) urls.add(match[1]);
  }

  return [...urls];
}

function parseSourcesValue(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter((item) => item.startsWith("http://") || item.startsWith("https://"));
}

interface ParsedAnswer {
  text: string;
  answeredBy?: string;
  lastVerified?: string;
  sourceUrls: string[];
  hasContent: boolean;
}

// Cleans raw answer text, extracts metadata lines, and filters out placeholders.
function parseAnswer(raw: string): ParsedAnswer {
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "</>") {
    return { text: "", sourceUrls: [], hasContent: false };
  }

  const cleaned = trimmed
    .replace(/^\*\*\[temp answer\]\*\*\s*/i, "")
    .replace(/^\[temp answer\]\s*/i, "")
    .trim();

  if (!cleaned || cleaned === "</>") {
    return { text: "", sourceUrls: [], hasContent: false };
  }

  const lines = cleaned.split("\n");
  const remaining: string[] = [];
  const sourceUrls = new Set<string>();
  let answeredBy: string | undefined;
  let lastVerified: string | undefined;

  let metadataPhase = true;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine && metadataPhase) {
      continue;
    }

    if (metadataPhase) {
      let matched = false;

      for (const pattern of ANSWERED_BY_PATTERNS) {
        const match = trimmedLine.match(pattern);
        if (match) {
          answeredBy = match[1].trim();
          matched = true;
          break;
        }
      }

      if (!matched) {
        for (const pattern of LAST_VERIFIED_PATTERNS) {
          const match = trimmedLine.match(pattern);
          if (match) {
            lastVerified = match[1].trim();
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        for (const pattern of SOURCES_PATTERNS) {
          const match = trimmedLine.match(pattern);
          if (match) {
            for (const url of parseSourcesValue(match[1])) {
              sourceUrls.add(url);
            }
            matched = true;
            break;
          }
        }
      }

      if (matched) continue;
      metadataPhase = false;
    }

    remaining.push(line);
  }

  const text = remaining.join("\n").trim();
  for (const url of extractUrls(text)) {
    sourceUrls.add(url);
  }

  return {
    text,
    answeredBy,
    lastVerified,
    sourceUrls: [...sourceUrls],
    hasContent: text.length > 0,
  };
}

// Parses a FAQ markdown file into structured FAQ entries.
export function parseMarkdownFile(content: string, filename: string): FAQEntry[] {
  const lines = content.split("\n");
  const entries: FAQEntry[] = [];
  const sourceFile = filename.split("/").pop() || filename;
  const fileSlug = sourceFile.replace(/\.md$/i, "");
  const isGeneralFaq = sourceFile === "general-faq.md";

  let category = fileSlug;
  let categorySlug = slugify(fileSlug);
  let subcategory = "General";
  let subcategorySlug = slugify(subcategory);
  let currentQuestion: string | null = null;
  let currentAnswerLines: string[] = [];

  function pushCurrent(): void {
    if (!currentQuestion) return;

    const parsed = parseAnswer(currentAnswerLines.join("\n"));
    if (!parsed.hasContent) {
      currentQuestion = null;
      currentAnswerLines = [];
      return;
    }

    const effectiveSubcategory = isGeneralFaq ? category : subcategory;
    const effectiveSubcategorySlug = isGeneralFaq ? categorySlug : subcategorySlug;

    entries.push({
      slug: "",
      question: currentQuestion.trim(),
      answer: parsed.text,
      tags: extractTags(currentQuestion, effectiveSubcategory, parsed.text),
      category,
      category_slug: categorySlug,
      subcategory: effectiveSubcategory,
      subcategory_slug: effectiveSubcategorySlug,
      source_file: sourceFile,
      source_urls: parsed.sourceUrls,
      last_verified_at: parsed.lastVerified || "auto",
      answered_by: parsed.answeredBy,
    });

    currentQuestion = null;
    currentAnswerLines = [];
  }

  for (const line of lines) {
    if (line.startsWith("# ")) {
      pushCurrent();
      category = line.slice(2).trim();
      categorySlug = slugify(category);
      if (isGeneralFaq) {
        subcategory = category;
        subcategorySlug = categorySlug;
      }
      continue;
    }

    if (line.startsWith("## ")) {
      pushCurrent();
      const heading = line.slice(3).trim();
      if (heading.toLowerCase() === "still need help?") break;

      if (isGeneralFaq) {
        currentQuestion = heading;
        currentAnswerLines = [];
      } else {
        subcategory = heading;
        subcategorySlug = slugify(subcategory);
      }
      continue;
    }

    if (line.startsWith("### ")) {
      pushCurrent();
      currentQuestion = line.slice(4).trim();
      currentAnswerLines = [];
      continue;
    }

    if (currentQuestion) {
      currentAnswerLines.push(line);
    }
  }

  pushCurrent();
  return entries;
}

// Assigns unique slugs after parsing all files.
export function assignSlugs(entries: FAQEntry[]): void {
  const seen = new Map<string, number>();

  for (const entry of entries) {
    const baseSlug = generateSlug(entry.question);
    let candidate = baseSlug;

    if (seen.has(candidate)) {
      candidate = `${baseSlug}-${entry.category_slug}`;
    }

    const count = seen.get(candidate) || 0;
    seen.set(candidate, count + 1);
    entry.slug = count === 0 ? candidate : `${candidate}-${count + 1}`;
  }
}

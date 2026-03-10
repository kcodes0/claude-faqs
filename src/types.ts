// A single FAQ entry as stored in faq-index.json and returned by the API.
// The `answer` field may contain markdown formatting (bold, links, lists).
export interface FAQEntry {
  slug: string;
  question: string;
  answer: string;
  tags: string[];
  category: string;
  category_slug: string;
  subcategory: string;
  subcategory_slug: string;
  source_file: string;
  source_urls: string[];
  last_verified_at: string;
  answered_by?: string;
}

export interface FAQCategorySummary {
  name: string;
  slug: string;
  count: number;
  subcategories: Array<{
    name: string;
    slug: string;
    count: number;
  }>;
}

// The full FAQ dataset loaded from faq-index.json at startup.
// `slugs` is a lookup map: slug -> index into the `entries` array.
export interface FAQData {
  version: string;
  generated_at: string;
  generated_timezone: string;
  entry_count: number;
  categories: string[];
  category_index: FAQCategorySummary[];
  category_slugs: Record<string, string>;
  entries: FAQEntry[];
  slugs: Record<string, number>;
}

// Discord embed format. Returned when `?format=discord` is passed.
export interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields: Array<{ name: string; value: string; inline?: boolean }>;
  footer: { text: string };
}

// Cloudflare Worker environment bindings.
export interface Env {
  RATE_LIMITS: KVNamespace;     // Sliding window rate limit counters
  FAQ_API_KEYS: KVNamespace;    // API key -> { name, tier }
  FAQ_EMBEDDINGS: KVNamespace;  // Cached embedding vectors for semantic search
  AI: Ai;                       // Cloudflare Workers AI binding
}

// Stored in FAQ_API_KEYS KV. The key is the API key string itself.
export interface ApiKeyData {
  name: string;
  tier: "standard" | "premium";
}

// Stored in RATE_LIMITS KV. resetAt is a Unix timestamp in milliseconds.
export interface RateLimitData {
  count: number;
  resetAt: number;
}

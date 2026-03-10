import { FAQ_DATA } from "./data";
import { embeddingSearch, tagSearch } from "./search";
import type { ApiKeyData, DiscordEmbed, Env, FAQEntry, RateLimitData } from "./types";

const DISCORD_COLOR = 0x7855fa; // Brand purple used in all Discord embeds
const EMBEDDING_CACHE_KEY = "faq:embeddings:v1";
const API_VERSION = "1.0.0";
const AI_RUNNER = (ai: Ai) => ai as unknown as {
  run(model: string, input: unknown): Promise<unknown>;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": status === 200 ? "public, max-age=60" : "no-store",
    },
  });
}

function cors(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-allow-headers", "Authorization, Content-Type");
  return new Response(response.body, { status: response.status, headers });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function summarizeEntry(entry: FAQEntry): object {
  return {
    slug: entry.slug,
    question: entry.question,
    category: entry.category,
    category_slug: entry.category_slug,
    subcategory: entry.subcategory,
    subcategory_slug: entry.subcategory_slug,
    tags: entry.tags,
    preview: entry.answer.slice(0, 200),
    answered_by: entry.answered_by,
    last_verified_at: entry.last_verified_at,
    source_urls: entry.source_urls,
  };
}

// Converts a FAQ entry into Discord's embed object format.
function toDiscordEmbed(entry: FAQEntry): DiscordEmbed {
  const description = entry.answer.length > 4096
    ? `${entry.answer.slice(0, 4093)}...`
    : entry.answer;

  const fields: DiscordEmbed["fields"] = [
    { name: "Category", value: entry.category, inline: true },
    { name: "Subcategory", value: entry.subcategory, inline: true },
    { name: "Slug", value: entry.slug, inline: false },
  ];

  if (entry.answered_by) {
    fields.push({ name: "Answered By", value: entry.answered_by, inline: true });
  }

  fields.push({ name: "Last Verified", value: entry.last_verified_at, inline: true });

  if (entry.source_urls.length) {
    fields.push({
      name: "Sources",
      value: entry.source_urls.slice(0, 5).map((url) => `- ${url}`).join("\n"),
      inline: false,
    });
  }

  return {
    title: entry.question,
    description,
    color: DISCORD_COLOR,
    fields,
    footer: { text: "Claude Community FAQ API" },
  };
}

async function updateWindow(
  kv: KVNamespace,
  key: string,
  limit: number,
  windowMs: number,
  suffix: string,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const storageKey = `rl:${key}:${suffix}`;
  const current = await kv.get<RateLimitData>(storageKey, "json");

  let next: RateLimitData;
  if (!current || current.resetAt <= now) {
    next = { count: 1, resetAt: now + windowMs };
  } else if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  } else {
    next = { count: current.count + 1, resetAt: current.resetAt };
  }

  const ttlSeconds = Math.max(60, Math.ceil((next.resetAt - now) / 1000) + 60);
  await kv.put(storageKey, JSON.stringify(next), { expirationTtl: ttlSeconds });

  return {
    allowed: true,
    remaining: Math.max(0, limit - next.count),
    resetAt: next.resetAt,
  };
}

// Sliding-window-ish rate limiter using KV. Good enough for admin-key usage.
async function checkRateLimit(
  kv: KVNamespace,
  key: string,
  limits: { perMinute: number; perDay: number },
): Promise<{
  allowed: boolean;
  minute: { remaining: number; resetAt: number };
  day: { remaining: number; resetAt: number };
}> {
  const minute = await updateWindow(kv, key, limits.perMinute, 60_000, "minute");
  if (!minute.allowed) {
    return { allowed: false, minute, day: { remaining: 0, resetAt: minute.resetAt } };
  }

  const day = await updateWindow(kv, key, limits.perDay, 86_400_000, "day");
  if (!day.allowed) {
    return { allowed: false, minute, day };
  }

  return { allowed: true, minute, day };
}

// Computes or loads FAQ entry embeddings for semantic search.
async function getEmbeddings(env: Env): Promise<number[][] | null> {
  const cached = await env.FAQ_EMBEDDINGS.get<number[][]>(EMBEDDING_CACHE_KEY, "json");
  if (cached) return cached;

  try {
    const texts = FAQ_DATA.entries.map((entry) =>
      `${entry.tags.join(" ")} ${entry.question} ${entry.answer.slice(0, 300)}`
    );

    const result = await AI_RUNNER(env.AI).run("@cf/baai/bge-base-en-v1.5", {
      text: texts,
    }) as { data: number[][] };

    await env.FAQ_EMBEDDINGS.put(EMBEDDING_CACHE_KEY, JSON.stringify(result.data), {
      expirationTtl: 3600,
    });

    return result.data;
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") {
      return cors(new Response(null, { status: 204 }));
    }

    if (request.method !== "GET" && request.method !== "POST") {
      return cors(json({ error: "Method not allowed." }, 405));
    }

    const subPath = path.startsWith("/claude-faqs/v1")
      ? path.slice("/claude-faqs/v1".length)
      : path.startsWith("/v1")
      ? path.slice("/v1".length)
      : path;
    const format = url.searchParams.get("format");

    // API key is required for all requests.
    const authHeader = request.headers.get("authorization");
    const apiKey = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : url.searchParams.get("apikey");

    if (!apiKey) {
      return cors(json({
        error: "Unauthorized",
        message: "API key required. Pass via Authorization: Bearer <key> header or ?apikey= parameter.",
      }, 401));
    }

    const keyData = await env.FAQ_API_KEYS.get<ApiKeyData>(apiKey, "json");
    if (!keyData) {
      return cors(json({ error: "Unauthorized", message: "Invalid API key." }, 401));
    }
    const authenticatedKey = keyData;

    const rateLimits = authenticatedKey.tier === "premium"
      ? { perMinute: 100, perDay: 10_000 }
      : { perMinute: 30, perDay: 1_000 };

    const rl = await checkRateLimit(env.RATE_LIMITS, apiKey, rateLimits);
    if (!rl.allowed) {
      const response = json({
        error: "Rate limit exceeded",
        limits: rateLimits,
        resets_at: {
          minute: new Date(rl.minute.resetAt).toISOString(),
          day: new Date(rl.day.resetAt).toISOString(),
        },
      }, 429);
      const headers = new Headers(response.headers);
      headers.set("x-ratelimit-remaining-minute", String(rl.minute.remaining));
      headers.set("x-ratelimit-remaining-day", String(rl.day.remaining));
      headers.set("x-authenticated-as", authenticatedKey.name);
      return cors(new Response(response.body, { status: 429, headers }));
    }

    function respond(data: object, status = 200): Response {
      const response = json(data, status);
      const headers = new Headers(response.headers);
      headers.set("x-ratelimit-remaining-minute", String(rl.minute.remaining));
      headers.set("x-ratelimit-remaining-day", String(rl.day.remaining));
      headers.set("x-ratelimit-reset-minute", new Date(rl.minute.resetAt).toISOString());
      headers.set("x-ratelimit-reset-day", new Date(rl.day.resetAt).toISOString());
      headers.set("x-authenticated-as", authenticatedKey.name);
      return cors(new Response(response.body, { status, headers }));
    }

    // Root: API metadata and route map.
    if (subPath === "" || subPath === "/") {
      return respond({
        name: "Claude FAQ API",
        version: API_VERSION,
        generated_at: FAQ_DATA.generated_at,
        entry_count: FAQ_DATA.entry_count,
        category_count: FAQ_DATA.category_index.length,
        auth: {
          description: "API key required for all requests",
          methods: ["Authorization: Bearer <key>", "?apikey=<key>"],
          tiers: {
            standard: "30/min, 1000/day",
            premium: "100/min, 10000/day",
          },
        },
        routes: {
          "GET /claude-faqs/v1/": "API metadata",
          "GET /claude-faqs/v1/search?q=...&mode=tags|semantic": "Search FAQs",
          "GET|POST /claude-faqs/v1/ask": "Generate an answer from FAQ context",
          "GET /claude-faqs/v1/categories": "List categories",
          "GET /claude-faqs/v1/category/{slug}": "Category detail",
          "GET /claude-faqs/v1/entries": "List entry summaries",
          "GET /claude-faqs/v1/slugs": "List all slugs",
          "GET /claude-faqs/v1/{slug}": "Fetch a full FAQ entry",
        },
      });
    }

    // Search route.
    if (subPath === "/search") {
      const query = url.searchParams.get("q")?.trim();
      if (!query) {
        return respond({ error: "Missing query", usage: "GET /search?q=your+query" }, 400);
      }

      const mode = url.searchParams.get("mode") === "semantic" ? "semantic" : "tags";
      const limit = clamp(Number(url.searchParams.get("limit") || 5), 1, 10);

      let results: FAQEntry[];
      if (mode === "semantic") {
        const embeddings = await getEmbeddings(env);
        if (!embeddings) {
          results = tagSearch(FAQ_DATA.entries, query, limit);
        } else {
          const qResult = await AI_RUNNER(env.AI).run("@cf/baai/bge-base-en-v1.5", { text: [query] }) as { data: number[][] };
          results = embeddingSearch(qResult.data[0], embeddings, FAQ_DATA.entries, limit);
        }
      } else {
        results = tagSearch(FAQ_DATA.entries, query, limit);
      }

      if (format === "discord") {
        return respond({ query, mode, count: results.length, results: results.map(toDiscordEmbed) });
      }

      return respond({
        query,
        mode,
        count: results.length,
        results: results.map(summarizeEntry),
      });
    }

    // Ask route: natural-language answer grounded in the FAQ corpus.
    if (subPath === "/ask") {
      let question = url.searchParams.get("q")?.trim() || null;
      if (!question && request.method === "POST") {
        try {
          const body = await request.json() as { question?: string };
          question = body.question?.trim() || null;
        } catch {
          return respond({ error: "Invalid JSON body" }, 400);
        }
      }

      if (!question) {
        return respond({ error: "Missing question", usage: "POST { \"question\": \"...\" } or GET /ask?q=..." }, 400);
      }

      let context: FAQEntry[];
      const embeddings = await getEmbeddings(env);
      if (embeddings) {
        const qResult = await AI_RUNNER(env.AI).run("@cf/baai/bge-base-en-v1.5", { text: [question] }) as { data: number[][] };
        context = embeddingSearch(qResult.data[0], embeddings, FAQ_DATA.entries, 3);
      } else {
        context = tagSearch(FAQ_DATA.entries, question, 3);
      }

      if (!context.length) {
        return respond({
          question,
          answer: "I couldn't find a relevant FAQ entry for that question yet.",
          sources: [],
        }, 404);
      }

      const faqContext = context
        .map((entry, index) => `[FAQ ${index + 1}] ${entry.question}\n${entry.answer}`)
        .join("\n\n---\n\n");

      try {
        const aiResult = await AI_RUNNER(env.AI).run("@cf/meta/llama-3.1-8b-instruct", {
          messages: [
            {
              role: "system",
              content: "Answer the user's question using only the FAQ context provided. If the context is incomplete, say so plainly and avoid inventing details.",
            },
            {
              role: "user",
              content: `Question: ${question}\n\nFAQ Context:\n${faqContext}`,
            },
          ],
          max_tokens: 700,
        }) as { response?: string };

        return respond({
          question,
          answer: aiResult.response || context[0].answer,
          sources: context.map((entry) => ({
            slug: entry.slug,
            question: entry.question,
            source_urls: entry.source_urls,
          })),
        });
      } catch {
        return respond({
          question,
          answer: context[0].answer,
          fallback: true,
          sources: context.map((entry) => ({
            slug: entry.slug,
            question: entry.question,
            source_urls: entry.source_urls,
          })),
        });
      }
    }

    // Category list.
    if (subPath === "/categories") {
      return respond({ count: FAQ_DATA.category_index.length, categories: FAQ_DATA.category_index });
    }

    // Category detail.
    if (subPath.startsWith("/category/")) {
      const categorySlug = subPath.replace("/category/", "");
      const category = FAQ_DATA.category_index.find((item) => item.slug === categorySlug);
      if (!category) {
        return respond({ error: "Category not found", slug: categorySlug }, 404);
      }

      const entries = FAQ_DATA.entries
        .filter((entry) => entry.category_slug === categorySlug)
        .map(summarizeEntry);

      return respond({ ...category, entries });
    }

    // Entry summaries.
    if (subPath === "/entries") {
      let entries = FAQ_DATA.entries;
      const category = url.searchParams.get("category")?.toLowerCase();
      const subcategory = url.searchParams.get("subcategory")?.toLowerCase();
      const limit = clamp(Number(url.searchParams.get("limit") || entries.length), 1, FAQ_DATA.entries.length);
      const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));

      if (category) {
        entries = entries.filter((entry) =>
          entry.category_slug === category ||
          entry.category.toLowerCase().includes(category) ||
          entry.category_slug.includes(category)
        );
      }

      if (subcategory) {
        entries = entries.filter((entry) =>
          entry.subcategory_slug === subcategory ||
          entry.subcategory.toLowerCase().includes(subcategory) ||
          entry.subcategory_slug.includes(subcategory)
        );
      }

      const paged = entries.slice(offset, offset + limit);
      return respond({ count: entries.length, offset, limit, entries: paged.map(summarizeEntry) });
    }

    // Slug list.
    if (subPath === "/slugs") {
      return respond({ count: FAQ_DATA.entry_count, slugs: Object.keys(FAQ_DATA.slugs) });
    }

    // Catch-all slug lookup.
    const slug = subPath.replace(/^\//, "");
    if (!slug || slug.includes("/")) {
      return respond({ error: "Not Found", message: `Unknown endpoint: ${path}` }, 404);
    }

    const entryIndex = FAQ_DATA.slugs[slug];
    if (entryIndex === undefined) {
      const suggestions = tagSearch(FAQ_DATA.entries, slug.replace(/-/g, " "), 3).map((entry) => ({
        slug: entry.slug,
        question: entry.question,
      }));

      return respond({ error: "FAQ entry not found", slug, did_you_mean: suggestions }, 404);
    }

    const entry = FAQ_DATA.entries[entryIndex];
    if (format === "discord") {
      return respond(toDiscordEmbed(entry));
    }

    return respond(entry);
  },
};

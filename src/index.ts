// Bun server: serves the React app AND the JSON API from one process.
import index from "./index.html";
import { clampCount, generateEmojis, isCategory, type NewEmoji } from "./lib/emojis";
import { store } from "./server/memory-store";

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),

  routes: {
    // ---- API -------------------------------------------------------------
    "/api/health": () => Response.json({ ok: true, storage: store.kind }),

    // GET /api/generate?category=food&count=6
    "/api/generate": (req) => {
      const params = new URL(req.url).searchParams;
      const category = params.get("category") ?? "mix";
      if (!isCategory(category)) {
        return Response.json({ error: `Unknown category "${category}"` }, { status: 400 });
      }
      const count = clampCount(Number(params.get("count") ?? 12));
      return Response.json(generateEmojis(category, count));
    },

    "/api/emojis": {
      GET: async () => Response.json(await store.list()),

      POST: async (req) => {
        const input = parseNewEmoji(await req.json().catch(() => null));
        if (!input) {
          return Response.json({ error: "Send JSON with emoji, name and category." }, { status: 400 });
        }
        return Response.json(await store.add(input), { status: 201 });
      },
    },

    "/api/emojis/:id": {
      DELETE: async (req) => {
        const removed = await store.remove(Number(req.params.id));
        return removed
          ? new Response(null, { status: 204 })
          : Response.json({ error: "Emoji not found" }, { status: 404 });
      },
    },

    // Unknown API paths get a JSON 404 instead of the HTML page
    "/api/*": Response.json({ error: "Not found" }, { status: 404 }),

    // ---- Frontend ----------------------------------------------------------
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

/** Validates a POST body. Returns null if anything is missing or the wrong type. */
function parseNewEmoji(body: unknown): NewEmoji | null {
  if (!body || typeof body !== "object") return null;
  const { emoji, name, category } = body as Record<string, unknown>;
  if (typeof emoji !== "string" || typeof name !== "string" || typeof category !== "string") return null;
  if (!emoji.trim() || !name.trim() || emoji.length > 32 || name.length > 60) return null;
  return { emoji, name: name.trim(), category };
}

console.log(`🚀 Emoji Generator running at ${server.url} (storage: ${store.kind})`);

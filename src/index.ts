// Bun server: serves the React app. API routes arrive in Step 2.
import index from "./index.html";

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),

  routes: {
    // Every path serves the React app (Bun bundles TSX + Tailwind on the fly)
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true, // hot reload in the browser
    console: true, // echo browser console logs in this terminal
  },
});

console.log(`🚀 Emoji Generator running at ${server.url}`);

# Emoji Generator: notes for Claude Code

This repo is used for a live 20-minute workshop demo. Keep every change small,
readable on a projector, and focused on the step being built.

## Stack
- Runtime + server: Bun. The server is `Bun.serve()` with the `routes` object in `src/index.ts`. No Express.
- Frontend: React 19 + TypeScript + Tailwind CSS v4, bundled by Bun's HTML imports. No Vite.
- Database (Step 3): PostgreSQL through Bun's built-in client: `import { SQL } from "bun"`. No ORM, no `pg` package.

## Commands
- `bun install`: install dependencies
- `bun dev`: dev server with hot reload on http://localhost:3000
- `bun run typecheck`: TypeScript check (run after every change)
- `docker compose up -d`: PostgreSQL on localhost:5432 (user, password, db: `emoji`)
- `bun run db:psql`: open a psql shell in the database container

## Layout
- `src/index.ts`: server entry; API routes live here
- `src/index.html`, `src/frontend.tsx`, `src/App.tsx`: React app
- `src/components/`: UI components (one component per file)
- `src/lib/emojis.ts`: shared types (`GeneratedEmoji`, `SavedEmoji`, `NewEmoji`, `EmojiStore`), emoji data, `generateEmojis()`
- `src/lib/api.ts`: browser-side fetch helpers (Step 2)
- `src/server/`: storage layer implementing `EmojiStore` (`memory-store.ts`, `pg-store.ts`)

## Conventions
- Function components with a typed `Props` interface and named exports.
- Tailwind utility classes only. Theme tokens from `src/index.css`: `paper`, `ink`, `cobalt`, `sun`, `font-display`, plus the `sheet-grid` utility.
- API responses are JSON. Errors are `{ "error": string }` with a matching HTTP status.
- Reuse the types in `src/lib/emojis.ts`; don't redefine them.
- Do not add dependencies unless the prompt asks for one.

# Emoji Generator with Claude Code

Workshop repo for **"Build an Emoji Generator with Claude Code: A Hands-on Workshop with React, TypeScript, Bun & PostgreSQL"**.

You generate a sheet of random emoji stickers, save the ones you like to an album, and the album is stored in PostgreSQL.

```
Browser (React + Tailwind)  ──fetch /api/*──▶  Bun.serve (one process, port 3000)  ──SQL──▶  PostgreSQL
        ▲                                         │
        └──────── HTML + bundled TSX/CSS ─────────┘
```

## Prerequisites

| Tool | Version | Check |
| --- | --- | --- |
| [Bun](https://bun.com) | 1.2.3 or newer (tested on 1.4) | `bun --version` |
| [Git](https://git-scm.com) | any recent | `git --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | for PostgreSQL in Step 3 | `docker compose version` |
| [Claude Code](https://code.claude.com/docs/en/setup) | optional, to prompt along | `claude --version` |

Install Bun: `curl -fsSL https://bun.com/install | bash` (macOS/Linux) or `powershell -c "irm bun.sh/install.ps1 | iex"` (Windows).

No Docker? Use any hosted PostgreSQL (for example a free Neon or Supabase database) and put its connection string in `.env` as `DATABASE_URL`.

## Quick start

```bash
git clone -b starter https://github.com/<your-org>/emoji-generator-workshop.git
cd emoji-generator-workshop
bun install
docker compose up -d      # start PostgreSQL now; it's needed in Step 3
bun dev                   # open http://localhost:3000
```

## Checkpoint branches

Every step is a branch. Each one builds on the previous and runs on its own.

| Branch | What it adds | Files touched |
| --- | --- | --- |
| `starter` | Bun server serving a React + Tailwind page | everything you clone |
| `step-1-ui` | Generator controls, sticker grid, album (all in the browser) | `src/App.tsx`, `src/components/*` |
| `step-2-bun-api` | `/api/generate` and `/api/emojis` endpoints; album lives in server memory | `src/index.ts`, `src/server/memory-store.ts`, `src/lib/api.ts`, `src/App.tsx` |
| `step-3-db-integration` | Album saved in PostgreSQL; survives restarts | `src/server/pg-store.ts`, one import in `src/index.ts` |
| `main` | Final version (same as Step 3) | none |

### Fell behind? Catch up in one line

Stop the dev server (`Ctrl+C`), then:

```bash
git stash -u && git switch step-2-bun-api && bun install && bun dev
```

Swap `step-2-bun-api` for whichever checkpoint the presenters are on. Your own work is kept in `git stash list`.

See exactly what a step changed:

```bash
git diff starter step-1-ui
git diff step-1-ui step-2-bun-api
git diff step-2-bun-api step-3-db-integration
```

## API reference (Step 2+)

| Method | Path | Body / query | Returns |
| --- | --- | --- | --- |
| GET | `/api/health` | | `{ ok, storage: "memory" \| "postgres" }` |
| GET | `/api/generate` | `?category=mix&count=12` | `GeneratedEmoji[]` |
| GET | `/api/emojis` | | `SavedEmoji[]` (newest first) |
| POST | `/api/emojis` | `{ emoji, name, category }` | `SavedEmoji`, status 201 |
| DELETE | `/api/emojis/:id` | | status 204, or 404 |

Try it: `curl "http://localhost:3000/api/generate?category=food&count=3"`

## Project structure

```
src/
├── index.ts            # Bun.serve: API routes + serves the React app
├── index.html          # HTML shell; Bun bundles the TSX and CSS it imports
├── index.css           # Tailwind v4 + workshop theme tokens
├── frontend.tsx        # React entry
├── App.tsx             # page layout and state
├── components/         # Controls, EmojiGrid, SavedPanel
├── lib/
│   ├── emojis.ts       # shared types, emoji data, generateEmojis()
│   └── api.ts          # fetch helpers (Step 2+)
└── server/
    ├── memory-store.ts # Step 2 storage
    └── pg-store.ts     # Step 3 storage
CLAUDE.md               # project notes Claude Code reads automatically
docker-compose.yml      # PostgreSQL 17
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Could not connect to PostgreSQL` | `docker compose up -d`, wait ~5 s, then restart `bun dev`. Check `DATABASE_URL` in `.env`. |
| Port 3000 already in use | `PORT=3001 bun dev` |
| Port 5432 already in use | Another Postgres is running. Stop it, or change the left side of `"5432:5432"` and your `DATABASE_URL`. |
| Styles missing | Make sure `bunfig.toml` exists and run `bun install` again. |
| `git switch` refuses: local changes | Run `git stash -u` first. |
| Saved emojis vanish in Step 2 | Expected: they live in server memory, and hot reload restarts the server. Step 3 fixes it. |

## Cloud option

Open the repo in GitHub Codespaces or a CodeSandbox Devbox; `.devcontainer/devcontainer.json` installs Bun and Docker. Then run `docker compose up -d && bun dev`.

import { SQL } from "bun";
import type { EmojiStore, SavedEmoji } from "../lib/emojis";

// Step 3: the album lives in PostgreSQL, so it survives restarts.
// Bun ships a PostgreSQL client, so there's no extra npm package to install.
const sql = new SQL(Bun.env.DATABASE_URL ?? "postgres://emoji:emoji@localhost:5432/emoji");

// Create the table on startup if it doesn't exist yet (a tiny "migration").
try {
  await sql`
    CREATE TABLE IF NOT EXISTS saved_emojis (
      id         SERIAL PRIMARY KEY,
      emoji      TEXT NOT NULL,
      name       TEXT NOT NULL,
      category   TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
} catch (err) {
  console.error("❌ Could not connect to PostgreSQL. Run `docker compose up -d` and check DATABASE_URL in .env");
  throw err;
}

export const store: EmojiStore = {
  kind: "postgres",

  async list() {
    return await sql<SavedEmoji[]>`
      SELECT id, emoji, name, category, created_at AS "createdAt"
      FROM saved_emojis
      ORDER BY created_at DESC, id DESC
    `;
  },

  async add(input) {
    const [row] = await sql<SavedEmoji[]>`
      INSERT INTO saved_emojis (emoji, name, category)
      VALUES (${input.emoji}, ${input.name}, ${input.category})
      RETURNING id, emoji, name, category, created_at AS "createdAt"
    `;
    return row!;
  },

  async remove(id) {
    const rows = await sql`DELETE FROM saved_emojis WHERE id = ${id} RETURNING id`;
    return rows.length > 0;
  },
};

import type { EmojiStore, SavedEmoji } from "../lib/emojis";

// Step 2: the album lives in a plain array inside the server process.
// Restart the server (or let hot reload restart it) and it's gone. Step 3 fixes that.
const saved: SavedEmoji[] = [];
let nextId = 1;

export const store: EmojiStore = {
  kind: "memory",

  async list() {
    return saved;
  },

  async add(input) {
    const entry: SavedEmoji = { ...input, id: nextId++, createdAt: new Date().toISOString() };
    saved.unshift(entry);
    return entry;
  },

  async remove(id) {
    const index = saved.findIndex((entry) => entry.id === id);
    if (index === -1) return false;
    saved.splice(index, 1);
    return true;
  },
};

import { useState } from "react";
import type { GeneratedEmoji } from "../lib/emojis";

// A slight tilt per sticker makes the grid look like a hand-placed sticker sheet.
const TILTS = ["-rotate-2", "rotate-1", "rotate-0", "rotate-2", "-rotate-1"];

interface EmojiGridProps {
  emojis: GeneratedEmoji[];
  onSave: (emoji: GeneratedEmoji) => void | Promise<void>;
}

export function EmojiGrid({ emojis, onSave }: EmojiGridProps) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  async function handleSave(item: GeneratedEmoji) {
    await onSave(item);
    setSavedIds((prev) => new Set(prev).add(item.id));
  }

  if (emojis.length === 0) {
    return (
      <div className="sheet-grid grid min-h-80 place-items-center rounded-3xl border-2 border-ink/10 p-6">
        <p className="text-lg text-ink/70">Press Generate to print a sticker sheet.</p>
      </div>
    );
  }

  return (
    <ul className="sheet-grid grid grid-cols-2 gap-5 rounded-3xl border-2 border-ink/10 p-6 sm:grid-cols-3 xl:grid-cols-4">
      {emojis.map((item, i) => {
        const saved = savedIds.has(item.id);
        return (
          <li
            key={item.id}
            className={`${TILTS[i % TILTS.length]} flex flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-[0_3px_0_rgba(27,31,59,0.18)] ring-1 ring-ink/10`}
          >
            <span role="img" aria-label={item.name} className="text-6xl leading-none">
              {item.emoji}
            </span>
            <span className="text-center text-sm font-bold">{item.name}</span>
            <button
              type="button"
              onClick={() => handleSave(item)}
              disabled={saved}
              className="rounded-full bg-cobalt px-4 py-1 text-sm font-bold text-white disabled:bg-ink/10 disabled:text-ink"
            >
              {saved ? "Saved" : "Save"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

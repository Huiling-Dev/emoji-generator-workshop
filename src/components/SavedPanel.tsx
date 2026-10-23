import type { SavedEmoji } from "../lib/emojis";

export type StorageKind = "browser" | "memory" | "postgres" | "offline";

// Tells the audience where the album lives right now. It changes at every workshop step.
const STORAGE_LABELS: Record<StorageKind, string> = {
  browser: "Stored in this browser tab. Refresh and it's gone.",
  memory: "Stored in server memory. Restart the server and it's gone.",
  postgres: "Stored in PostgreSQL. Survives restarts.",
  offline: "Server not reachable. Is bun dev running?",
};

interface SavedPanelProps {
  saved: SavedEmoji[];
  storage: StorageKind;
  onDelete: (id: number) => void;
}

export function SavedPanel({ saved, storage, onDelete }: SavedPanelProps) {
  return (
    <aside className="self-start rounded-3xl border-2 border-ink bg-white p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold">Your album</h2>
        <span className="text-sm font-bold text-ink/60">{saved.length} saved</span>
      </div>
      <p className="mt-1 text-sm text-ink/70">{STORAGE_LABELS[storage]}</p>

      {saved.length === 0 ? (
        <p className="mt-6 text-ink/70">Nothing saved yet. Press Save on any sticker to keep it here.</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-2">
          {saved.map((item) => (
            <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-paper px-3 py-2">
              <span aria-hidden="true" className="text-3xl">{item.emoji}</span>
              <span className="flex-1 font-bold leading-tight">{item.name}</span>
              <button
                type="button"
                onClick={() => onDelete(item.id)}
                aria-label={`Remove ${item.name}`}
                className="rounded-full px-2 py-1 text-sm font-bold text-ink/60 hover:bg-white hover:text-ink"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

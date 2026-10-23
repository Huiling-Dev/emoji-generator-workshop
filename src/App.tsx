import { useEffect, useState } from "react";
import { Controls } from "./components/Controls";
import { EmojiGrid } from "./components/EmojiGrid";
import { SavedPanel, type StorageKind } from "./components/SavedPanel";
import { api } from "./lib/api";
import type { Category, GeneratedEmoji, SavedEmoji } from "./lib/emojis";

export function App() {
  const [category, setCategory] = useState<Category>("mix");
  const [count, setCount] = useState(12);
  const [emojis, setEmojis] = useState<GeneratedEmoji[]>([]);
  const [saved, setSaved] = useState<SavedEmoji[]>([]);
  const [storage, setStorage] = useState<StorageKind>("offline");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On page load: ask the server where it stores data, load the album, print a first sheet.
  useEffect(() => {
    api.health().then((h) => setStorage(h.storage)).catch(() => setStorage("offline"));
    api.listSaved().then(setSaved).catch(showError);
    handleGenerate();
  }, []);

  function showError(err: unknown) {
    setError(err instanceof Error ? err.message : String(err));
  }

  // Step 2: the browser asks the Bun API instead of generating and storing locally.
  async function handleGenerate() {
    setBusy(true);
    setError(null);
    try {
      setEmojis(await api.generate(category, count));
    } catch (err) {
      showError(err);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave(item: GeneratedEmoji) {
    try {
      const entry = await api.save({ emoji: item.emoji, name: item.name, category: item.category });
      setSaved((prev) => [entry, ...prev]);
    } catch (err) {
      showError(err);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.remove(id);
      setSaved((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err) {
      showError(err);
    }
  }

  return (
    <main className="min-h-screen bg-paper font-sans text-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <h1 className="font-display text-5xl font-semibold tracking-tight">Emoji Generator</h1>
          <p className="mt-2 max-w-xl text-lg text-ink/75">
            Pick a theme, choose how many, and generate a fresh sticker sheet. Save the ones you like to your album.
          </p>
        </header>

        <Controls
          category={category}
          count={count}
          busy={busy}
          onCategoryChange={setCategory}
          onCountChange={setCount}
          onGenerate={handleGenerate}
        />

        {error && (
          <p role="alert" className="mt-6 rounded-2xl border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <EmojiGrid emojis={emojis} onSave={handleSave} />
          <SavedPanel saved={saved} storage={storage} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}

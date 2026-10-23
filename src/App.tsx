import { useState } from "react";
import { Controls } from "./components/Controls";
import { EmojiGrid } from "./components/EmojiGrid";
import { SavedPanel } from "./components/SavedPanel";
import { generateEmojis, type Category, type GeneratedEmoji, type SavedEmoji } from "./lib/emojis";

export function App() {
  const [category, setCategory] = useState<Category>("mix");
  const [count, setCount] = useState(12);
  const [emojis, setEmojis] = useState<GeneratedEmoji[]>(() => generateEmojis("mix", 12));
  const [saved, setSaved] = useState<SavedEmoji[]>([]);

  // Step 1: everything happens in the browser. Step 2 moves this to the Bun API.
  function handleGenerate() {
    setEmojis(generateEmojis(category, count));
  }

  function handleSave(item: GeneratedEmoji) {
    const entry: SavedEmoji = {
      id: Date.now(),
      emoji: item.emoji,
      name: item.name,
      category: item.category,
      createdAt: new Date().toISOString(),
    };
    setSaved((prev) => [entry, ...prev]);
  }

  function handleDelete(id: number) {
    setSaved((prev) => prev.filter((entry) => entry.id !== id));
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
          onCategoryChange={setCategory}
          onCountChange={setCount}
          onGenerate={handleGenerate}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <EmojiGrid emojis={emojis} onSave={handleSave} />
          <SavedPanel saved={saved} storage="browser" onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}

// Shared emoji data, types and the generator.
// Step 1 calls generateEmojis() in the browser; Step 2 moves the call to the Bun server.

export const EMOJI_SETS = {
  faces: ["😀", "😂", "🥹", "😎", "🤩", "🥳", "😴", "🤯", "😇", "🤓", "😜", "🫠", "🤠", "😺", "👻", "🤖"],
  animals: ["🐶", "🐱", "🦊", "🐼", "🐨", "🐸", "🐙", "🦄", "🐝", "🦋", "🐢", "🦖", "🐧", "🦉", "🐳", "🦔"],
  food: ["🍕", "🍔", "🌮", "🍣", "🍩", "🍪", "🍓", "🥑", "🍜", "🧁", "🍉", "🥨", "🍿", "🧋", "🍦", "🥐"],
  nature: ["🌸", "🌻", "🌵", "🍀", "🌈", "🌊", "🔥", "❄️", "🌙", "⭐", "🍄", "🌴", "🌋", "⚡", "🍁", "🌷"],
  space: ["🚀", "🛸", "🪐", "🌍", "☄️", "🌌", "👽", "🛰️", "🔭", "🌠", "🌕", "👩‍🚀"],
  party: ["🎉", "🎈", "🎁", "🎂", "🪩", "🎊", "🥂", "🎶", "🎸", "🕺", "💃", "🎤", "🎮", "🏆"],
} as const;

export type SetName = keyof typeof EMOJI_SETS;
export type Category = SetName | "mix";

export const CATEGORY_OPTIONS: { value: Category; label: string; icon: string }[] = [
  { value: "mix", label: "Mix", icon: "🎲" },
  { value: "faces", label: "Faces", icon: "😀" },
  { value: "animals", label: "Animals", icon: "🦊" },
  { value: "food", label: "Food", icon: "🍕" },
  { value: "nature", label: "Nature", icon: "🌸" },
  { value: "space", label: "Space", icon: "🚀" },
  { value: "party", label: "Party", icon: "🎉" },
];

export const MAX_COUNT = 24;

/** One sticker on the generated sheet (not saved yet). */
export interface GeneratedEmoji {
  id: string;
  emoji: string;
  name: string;
  category: SetName;
}

/** What the client sends to save a sticker. */
export interface NewEmoji {
  emoji: string;
  name: string;
  category: string;
}

/** A sticker saved in the album. */
export interface SavedEmoji extends NewEmoji {
  id: number;
  createdAt: string;
}

/** Storage layer contract: Step 2 implements it in memory, Step 3 in PostgreSQL. */
export interface EmojiStore {
  kind: "memory" | "postgres";
  list(): Promise<SavedEmoji[]>;
  add(input: NewEmoji): Promise<SavedEmoji>;
  remove(id: number): Promise<boolean>;
}

const ADJECTIVES = [
  "Sparkly", "Grumpy", "Cosmic", "Sleepy", "Turbo", "Fancy", "Sneaky", "Chill",
  "Mega", "Tiny", "Brave", "Wobbly", "Spicy", "Shiny", "Lucky", "Fluffy",
];

const NOUNS: Record<SetName, string> = {
  faces: "Mood",
  animals: "Critter",
  food: "Snack",
  nature: "Sprout",
  space: "Comet",
  party: "Vibe",
};

const SET_NAMES = Object.keys(EMOJI_SETS) as SetName[];

export function isCategory(value: string): value is Category {
  return value === "mix" || Object.hasOwn(EMOJI_SETS, value);
}

export function clampCount(value: number): number {
  if (!Number.isFinite(value)) return 12;
  return Math.min(Math.max(Math.round(value), 1), MAX_COUNT);
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}

/** Builds a sheet of random stickers, without repeats until the pool runs out. */
export function generateEmojis(category: Category, count: number): GeneratedEmoji[] {
  const sets = category === "mix" ? SET_NAMES : [category];
  const pool = shuffle(sets.flatMap((set) => EMOJI_SETS[set].map((emoji) => ({ emoji, set }))));

  return Array.from({ length: clampCount(count) }, (_, i) => {
    const { emoji, set } = pool[i % pool.length]!;
    return {
      id: Math.random().toString(36).slice(2, 10),
      emoji,
      name: `${pick(ADJECTIVES)} ${NOUNS[set]}`,
      category: set,
    };
  });
}

import { CATEGORY_OPTIONS, MAX_COUNT, type Category } from "../lib/emojis";

interface ControlsProps {
  category: Category;
  count: number;
  busy?: boolean;
  onCategoryChange: (category: Category) => void;
  onCountChange: (count: number) => void;
  onGenerate: () => void;
}

export function Controls({ category, count, busy = false, onCategoryChange, onCountChange, onGenerate }: ControlsProps) {
  return (
    <section aria-label="Generator controls" className="flex flex-wrap items-end gap-x-10 gap-y-6">
      <fieldset>
        <legend className="mb-2 font-display text-lg font-medium">Theme</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((option) => {
            const active = option.value === category;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onCategoryChange(option.value)}
                className={`rounded-full border-2 px-4 py-2 font-bold transition-colors ${
                  active ? "border-ink bg-ink text-paper" : "border-ink/20 bg-white hover:border-ink"
                }`}
              >
                <span aria-hidden="true" className="mr-1.5">{option.icon}</span>
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-end gap-6">
        <label className="flex flex-col gap-2">
          <span className="font-display text-lg font-medium">How many: {count}</span>
          <input
            type="range"
            min={1}
            max={MAX_COUNT}
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="w-52 accent-cobalt"
          />
        </label>

        <button
          type="button"
          onClick={onGenerate}
          disabled={busy}
          className="rounded-2xl border-2 border-ink bg-sun px-8 py-3 font-display text-xl font-semibold shadow-[4px_4px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
        >
          {busy ? "Generating…" : "Generate"}
        </button>
      </div>
    </section>
  );
}

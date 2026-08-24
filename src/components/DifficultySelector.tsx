import { Layers } from 'lucide-react';
import type { Difficulty, DifficultyConfig } from '../types';
import { ACCENT } from '../constants';

interface DifficultySelectorProps {
  options: DifficultyConfig[];
  selected: Difficulty | null;
  onSelect: (option: DifficultyConfig) => void;
}

export function DifficultySelector({
  options,
  selected,
  onSelect,
}: DifficultySelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-neutral-500">
        <Layers className="h-4 w-4" />
        Choose difficulty
      </div>
      <div className="grid grid-cols-3 gap-3">
        {options.map((opt) => {
          const active = opt.key === selected;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelect(opt)}
              className={`group flex flex-col items-center gap-1 rounded-2xl border-2 px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 ${
                active
                  ? `${ACCENT.border} ${ACCENT.softBg} shadow-md`
                  : 'border-neutral-200 bg-white hover:border-rose-200'
              }`}
              aria-pressed={active}
            >
              <span
                className={`text-base font-bold ${active ? ACCENT.softText : 'text-neutral-800'}`}
              >
                {opt.label}
              </span>
              <span className="text-xs font-medium text-neutral-500">
                {opt.size}×{opt.size} · {opt.pieces} pieces
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

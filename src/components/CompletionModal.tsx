import { useEffect, useState } from 'react';
import { Trophy, RotateCcw, ImagePlus, X } from 'lucide-react';
import { formatTime } from '../hooks/useTimer';

interface CompletionModalProps {
  open: boolean;
  time: number;
  moves: number;
  imageSrc: string;
  onPlayAgain: () => void;
  onNewPuzzle: () => void;
  onClose: () => void;
}

export function CompletionModal({
  open,
  time,
  moves,
  imageSrc,
  onPlayAgain,
  onNewPuzzle,
  onClose,
}: CompletionModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-neutral-900/50 p-4 backdrop-blur-sm transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 text-center shadow-2xl transition-all duration-300 ${
          show ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <Confetti active={show} />

        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-orange-500/30">
          <Trophy className="h-8 w-8" strokeWidth={2.2} />
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">
          Puzzle Complete!
        </h2>
        <p className="mt-1 text-neutral-500">Beautifully done.</p>

        <div className="mx-auto my-5 aspect-square w-32 overflow-hidden rounded-2xl border-2 border-neutral-100 shadow-sm">
          <img src={imageSrc} alt="Completed puzzle" className="h-full w-full object-cover" />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <Stat label="Time" value={formatTime(time)} />
          <Stat label="Moves" value={String(moves)} />
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 px-5 py-3 font-bold text-white shadow-lg shadow-rose-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
          >
            <RotateCcw className="h-5 w-5" />
            Play Again
          </button>
          <button
            onClick={onNewPuzzle}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-neutral-200 px-5 py-3 font-bold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-50 active:translate-y-0"
          >
            <ImagePlus className="h-5 w-5" />
            New Puzzle
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-neutral-50 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums text-neutral-900">{value}</div>
    </div>
  );
}

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#f43f5e', '#fb923c', '#facc15', '#34d399', '#60a5fa', '#a78bfa'];
  const pieces = Array.from({ length: 28 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.4 + Math.random() * 1.2;
        const color = colors[i % colors.length];
        const size = 6 + Math.random() * 6;
        const rotate = Math.random() * 360;
        return (
          <span
            key={i}
            className="absolute top-[-20px] block motion-reduce:hidden"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.6,
              background: color,
              borderRadius: 2,
              transform: `rotate(${rotate}deg)`,
              animationName: 'confetti-fall',
              animationDuration: `${dur}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: 'ease-in',
              animationFillMode: 'forwards',
            }}
          />
        );
      })}
    </div>
  );
}

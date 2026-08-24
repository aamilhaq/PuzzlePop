import { Clock, Puzzle as PuzzleIcon, Move } from 'lucide-react';
import { formatTime } from '../hooks/useTimer';

interface GameHeaderProps {
  time: number;
  moves: number;
  totalPieces: number;
  placedPieces: number;
}

export function GameHeader({
  time,
  moves,
  totalPieces,
  placedPieces,
}: GameHeaderProps) {
  const pct = totalPieces === 0 ? 0 : Math.round((placedPieces / totalPieces) * 100);

  return (
    <div className="w-full">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat icon={<Clock className="h-4 w-4" />} label="Time" value={formatTime(time)} />
          <Stat
            icon={<PuzzleIcon className="h-4 w-4" />}
            label="Pieces"
            value={`${placedPieces} / ${totalPieces}`}
          />
          <Stat icon={<Move className="h-4 w-4" />} label="Moves" value={String(moves)} />
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={placedPieces}
            aria-valuemin={0}
            aria-valuemax={totalPieces}
          />
        </div>
        <p className="text-center text-sm font-semibold text-neutral-600">
          {placedPieces} / {totalPieces} pieces
        </p>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-neutral-200 bg-white/80 px-2 py-2.5 shadow-sm backdrop-blur-sm sm:py-3">
      <div className="flex items-center gap-1.5 text-rose-500">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      </div>
      <span className="text-base font-bold tabular-nums text-neutral-900 sm:text-lg">
        {value}
      </span>
    </div>
  );
}

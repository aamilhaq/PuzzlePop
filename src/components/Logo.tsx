import { Puzzle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'lg' }: LogoProps) {
  const big = size === 'lg';
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`grid place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-500/30 ${
          big ? 'h-14 w-14' : 'h-10 w-10'
        }`}
      >
        <Puzzle className={big ? 'h-8 w-8' : 'h-6 w-6'} strokeWidth={2.2} />
      </div>
      <h1
        className={`font-extrabold tracking-tight text-neutral-900 ${
          big ? 'text-4xl sm:text-5xl' : 'text-2xl'
        }`}
      >
        Puzzle<span className="text-rose-500">Pop</span>
      </h1>
    </div>
  );
}

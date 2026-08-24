import { useCallback, useEffect, useRef, useState } from 'react';
import { Shuffle, RotateCcw, ArrowLeft, Image as ImageIcon, Eye, X } from 'lucide-react';
import { Logo } from './Logo';
import { GameHeader } from './GameHeader';
import { PuzzleBoard } from './PuzzleBoard';
import { CompletionModal } from './CompletionModal';
import { useTimer } from '../hooks/useTimer';
import type { DifficultyConfig, PuzzleImage } from '../types';

interface PuzzleGameProps {
  image: PuzzleImage;
  difficulty: DifficultyConfig;
  customSrc?: string;
  onExit: () => void;
}

export function PuzzleGame({
  image,
  difficulty,
  customSrc,
  onExit,
}: PuzzleGameProps) {
  const imageSrc = customSrc ?? image.url;
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shuffleSignal, setShuffleSignal] = useState(0);
  const [restartSignal, setRestartSignal] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [finalMoves, setFinalMoves] = useState(0);
  const movesRef = useRef(0);
  const secondsRef = useRef(0);
  const [moves, setMoves] = useState(0);
  const [placed, setPlaced] = useState(0);

  const running = started && !completed;
  const { seconds, reset: resetTimer } = useTimer(running);
  secondsRef.current = seconds;

  const handleComplete = useCallback(() => {
    setCompleted(true);
    setModalOpen(true);
    setFinalTime(secondsRef.current);
    setFinalMoves(movesRef.current);
  }, []);

  // Auto-start the timer shortly after mount.
  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => setStarted(true), 80);
      return () => clearTimeout(t);
    }
  }, [started]);

  const handleStatsChange = useCallback((stats: { moves: number; placed: number }) => {
    movesRef.current = stats.moves;
    setMoves(stats.moves);
    setPlaced(stats.placed);
  }, []);

  const handleShuffle = useCallback(() => {
    setCompleted(false);
    setModalOpen(false);
    setShuffleSignal((s) => s + 1);
    resetTimer();
    setStarted(false);
    setMoves(0);
    setPlaced(0);
    movesRef.current = 0;
  }, [resetTimer]);

  const handleRestart = useCallback(() => {
    setCompleted(false);
    setModalOpen(false);
    setRestartSignal((s) => s + 1);
    resetTimer();
    setStarted(false);
    setMoves(0);
    setPlaced(0);
    movesRef.current = 0;
  }, [resetTimer]);

  const handlePlayAgain = useCallback(() => {
    handleRestart();
  }, [handleRestart]);

  const handleNewPuzzle = useCallback(() => {
    onExit();
  }, [onExit]);

  const [peek, setPeek] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-3 py-5 sm:px-4 sm:py-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>
        <Logo size="sm" />
        <div className="w-[68px]" />
      </div>

      <div className="mt-5">
        <GameHeader
          time={seconds}
          moves={moves}
          totalPieces={difficulty.pieces}
          placedPieces={placed}
        />
      </div>

      <div className="mt-5 flex flex-1 items-center justify-center">
        <PuzzleBoard
          key={`${image.id}-${difficulty.key}`}
          difficulty={difficulty}
          imageSrc={imageSrc}
          fallbackClass={image.fallback}
          onComplete={handleComplete}
          onStatsChange={handleStatsChange}
          shuffleSignal={shuffleSignal}
          restartSignal={restartSignal}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <ControlButton icon={<Shuffle className="h-4 w-4" />} label="Shuffle" onClick={handleShuffle} />
        <ControlButton icon={<RotateCcw className="h-4 w-4" />} label="Restart" onClick={handleRestart} />
        <ControlButton icon={<Eye className="h-4 w-4" />} label="Peek" onClick={() => setPeek(true)} />
        <ControlButton icon={<ImageIcon className="h-4 w-4" />} label="Change Puzzle" onClick={onExit} />
      </div>

      <CompletionModal
        open={modalOpen}
        time={finalTime}
        moves={finalMoves}
        imageSrc={imageSrc}
        onPlayAgain={handlePlayAgain}
        onNewPuzzle={handleNewPuzzle}
        onClose={() => setModalOpen(false)}
      />

      {peek && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-neutral-900/50 p-4 backdrop-blur-sm"
          onClick={() => setPeek(false)}
        >
          <div
            className="relative max-h-[80vh] max-w-[80vh] overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={imageSrc} alt="Reference" className="block max-h-[80vh] w-full object-contain" />
            <button
              onClick={() => setPeek(false)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-neutral-700 shadow-md transition-colors hover:bg-white"
              aria-label="Close peek"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:text-rose-500 hover:shadow-md active:translate-y-0"
    >
      {icon}
      {label}
    </button>
  );
}

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { DifficultyConfig } from '../types';
import { usePuzzleState, lockedCount } from '../hooks/usePuzzleState';

interface PuzzleBoardProps {
  difficulty: DifficultyConfig;
  imageSrc: string;
  fallbackClass: string;
  onComplete: () => void;
  onStatsChange?: (stats: { moves: number; placed: number }) => void;
  /** Bumped to trigger a re-shuffle from the parent. */
  shuffleSignal: number;
  /** Bumped to trigger a full restart from the parent. */
  restartSignal: number;
}

interface ActiveDrag {
  pieceId: number;
  fromSlot: number;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  dx: number;
  dy: number;
}

const SNAP_THRESHOLD = 0.42; // fraction of cell size

export function PuzzleBoard({
  difficulty,
  imageSrc,
  fallbackClass,
  onComplete,
  onStatsChange,
  shuffleSignal,
  restartSignal,
}: PuzzleBoardProps) {
  const { size, pieces: total } = difficulty;
  const { model, moves, shuffle, movePiece, solved } = usePuzzleState(difficulty);

  const boardRef = useRef<HTMLDivElement>(null);
  const [boardPx, setBoardPx] = useState(0);
  const [active, setActive] = useState<ActiveDrag | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Re-create puzzle on restart or difficulty change (skip initial mount).
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    shuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartSignal, difficulty.key]);

  // Shuffle-only.
  useEffect(() => {
    if (shuffleSignal > 0) shuffle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSignal]);

  // Measure board with ResizeObserver so pieces track responsive width.
  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const update = () => setBoardPx(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Notify completion once.
  useEffect(() => {
    if (solved) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved]);

  // Reset image load state when the image changes.
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageSrc]);

  const cell = boardPx / size;

  const onPointerDown = useCallback(
    (e: React.PointerEvent, pieceId: number, fromSlot: number) => {
      const piece = model.pieces[pieceId];
      if (piece.locked) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setActive({
        pieceId,
        fromSlot,
        pointerId: e.pointerId,
        startClientX: e.clientX,
        startClientY: e.clientY,
        dx: 0,
        dy: 0,
      });
    },
    [model.pieces],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active || e.pointerId !== active.pointerId) return;
      setActive({
        ...active,
        dx: e.clientX - active.startClientX,
        dy: e.clientY - active.startClientY,
      });
    },
    [active],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!active || e.pointerId !== active.pointerId) return;
      if (!boardRef.current) {
        setActive(null);
        return;
      }
      // Center of the dragged piece in board coordinates.
      const fromRow = Math.floor(active.fromSlot / size);
      const fromCol = active.fromSlot % size;
      const centerX =
        fromCol * cell + cell / 2 + active.dx;
      const centerY =
        fromRow * cell + cell / 2 + active.dy;

      const toCol = Math.floor(centerX / cell);
      const toRow = Math.floor(centerY / cell);
      const toSlot =
        toRow >= 0 && toRow < size && toCol >= 0 && toCol < size
          ? toRow * size + toCol
          : -1;

      if (toSlot >= 0) {
        const targetCenterRow = Math.floor(toSlot / size);
        const targetCenterCol = toSlot % size;
        const targetX = targetCenterCol * cell + cell / 2;
        const targetY = targetCenterRow * cell + cell / 2;
        const dist = Math.hypot(centerX - targetX, centerY - targetY);
        if (dist <= cell * SNAP_THRESHOLD) {
          movePiece(active.fromSlot, toSlot);
        }
      }
      setActive(null);
    },
    [active, cell, size, movePiece],
  );

  const onPointerCancel = useCallback(() => setActive(null), []);

  const cellBg = (correctIndex: number) => {
    const row = Math.floor(correctIndex / size);
    const col = correctIndex % size;
    return {
      backgroundImage: `url("${imageSrc}")`,
      backgroundSize: `${boardPx}px ${boardPx}px`,
      backgroundPosition: `${-col * cell}px ${-row * cell}px`,
    };
  };

  const placed = lockedCount(model);

  useEffect(() => {
    onStatsChange?.({ moves, placed });
  }, [moves, placed, onStatsChange]);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={boardRef}
        className="relative aspect-square w-full max-w-[min(92vw,560px)] touch-none select-none overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 shadow-xl shadow-neutral-900/10"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
        }}
      >
        {/* Faint guide grid + empty slot outlines */}
        <div
          className="absolute inset-0 grid"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}
        >
          {Array.from({ length: total }).map((_, i) => {
            const pieceId = model.slots[i];
            const isCorrect = pieceId === i;
            return (
              <div
                key={i}
                className={`relative border border-white/40 transition-colors duration-300 ${
                  isCorrect ? 'bg-emerald-400/10' : 'bg-neutral-200/30'
                }`}
              >
                {/* subtle slot index watermark */}
                {!imageError && !isCorrect && (
                  <span className="pointer-events-none absolute right-1 top-1 text-[9px] font-bold text-neutral-400/40">
                    {i + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Fallback gradient if image fails */}
        {imageError && (
          <div className={`absolute inset-0 bg-gradient-to-br ${fallbackClass}`} />
        )}

        {/* Pieces layer */}
        {!imageError && boardPx > 0 && (
          <div className="absolute inset-0">
            {model.slots.map((pieceId, slotIndex) => {
              if (pieceId === null) return null;
              const piece = model.pieces[pieceId];
              const row = Math.floor(slotIndex / size);
              const col = slotIndex % size;
              const isActive = active?.pieceId === pieceId;
              const baseTransform = `translate3d(${col * cell}px, ${row * cell}px, 0)`;
              const dragTransform = isActive
                ? `translate3d(${col * cell + active.dx}px, ${row * cell + active.dy}px, 0) scale(1.06)`
                : baseTransform;

              return (
                <div
                  key={pieceId}
                  onPointerDown={(e) => onPointerDown(e, pieceId, slotIndex)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                  className={`absolute left-0 top-0 rounded-[6px] ${
                    piece.locked
                      ? 'cursor-default ring-2 ring-emerald-400/70'
                      : 'cursor-grab touch-none ring-1 ring-black/10 hover:z-20 hover:ring-2 hover:ring-rose-400/70'
                  } ${isActive ? 'z-30 cursor-grabbing shadow-2xl' : ''} transition-[transform,box-shadow] duration-200 ease-out motion-reduce:transition-none`}
                  style={{
                    width: cell,
                    height: cell,
                    transform: dragTransform,
                    ...cellBg(piece.correctIndex),
                  }}
                >
                  {piece.locked && (
                    <div className="pointer-events-none absolute inset-0 rounded-[6px] bg-emerald-400/10 transition-opacity" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Loading veil */}
        {!imageError && !imageLoaded && (
          <div className="absolute inset-0 grid place-items-center bg-neutral-100">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-rose-500" />
          </div>
        )}
      </div>

      <p className="mt-3 text-sm font-medium text-neutral-500">{moves} moves</p>

      {/* Hidden preloader to track load state */}
      {!imageError && (
        <img
          src={imageSrc}
          alt=""
          className="hidden"
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
        />
      )}
    </div>
  );
}

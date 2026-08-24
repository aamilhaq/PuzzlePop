import { useCallback, useMemo, useState } from 'react';
import type { DifficultyConfig } from '../types';

export interface PieceState {
  id: number;
  /** Correct grid index (row * size + col). */
  correctIndex: number;
  /** Whether the piece is locked in its correct slot. */
  locked: boolean;
}

export interface PuzzleModel {
  size: number;
  total: number;
  pieces: PieceState[];
  /** Ordered by slot index -> pieceId (null = empty) */
  slots: (number | null)[];
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function createPuzzleModel(difficulty: DifficultyConfig): PuzzleModel {
  const total = difficulty.pieces;
  // slotAssignment[slotIndex] = pieceId placed in that slot
  const slotAssignment = shuffleArray(Array.from({ length: total }, (_, i) => i));
  // Avoid starting in an already-solved arrangement.
  if (slotAssignment.every((pieceId, slotIndex) => pieceId === slotIndex)) {
    [slotAssignment[0], slotAssignment[1]] = [slotAssignment[1], slotAssignment[0]];
  }

  // Index pieces by pieceId so model.pieces[pieceId] is always valid.
  const pieces: PieceState[] = Array.from({ length: total }, (_, pieceId) => {
    const slotIndex = slotAssignment.indexOf(pieceId);
    return { id: pieceId, correctIndex: pieceId, locked: pieceId === slotIndex };
  });

  return {
    size: difficulty.size,
    total,
    pieces,
    slots: slotAssignment,
  };
}

export function isSolved(model: PuzzleModel): boolean {
  return model.slots.every((pieceId, slotIndex) => pieceId === slotIndex);
}

export function lockedCount(model: PuzzleModel): number {
  return model.slots.filter((pieceId, slotIndex) => pieceId === slotIndex).length;
}

export interface PuzzleStateApi {
  model: PuzzleModel;
  moves: number;
  shuffle: () => void;
  /**
   * Move the piece currently in `fromSlot` into `toSlot`, swapping with any
   * piece already there. Returns true if the move changed state.
   */
  movePiece: (fromSlot: number, toSlot: number) => boolean;
  solved: boolean;
}

export function usePuzzleState(difficulty: DifficultyConfig): PuzzleStateApi {
  const [model, setModel] = useState<PuzzleModel>(() => createPuzzleModel(difficulty));
  const [moves, setMoves] = useState(0);

  const shuffle = useCallback(() => {
    setModel(createPuzzleModel({ ...difficulty }));
    setMoves(0);
  }, [difficulty]);

  const movePiece = useCallback((fromSlot: number, toSlot: number) => {
    if (fromSlot === toSlot) return false;

    let changed = false;
    setModel((prev) => {
      const movingPieceId = prev.slots[fromSlot];
      if (movingPieceId === null) return prev;
      // Don't allow moving a locked piece out of its correct slot.
      if (prev.pieces[movingPieceId].locked) return prev;

      const targetPieceId = prev.slots[toSlot];
      // Can't displace a locked piece.
      if (
        targetPieceId !== null &&
        prev.pieces[targetPieceId].locked
      ) {
        return prev;
      }

      const nextSlots = prev.slots.slice();
      nextSlots[toSlot] = movingPieceId;
      nextSlots[fromSlot] = targetPieceId;

      const nextPieces = prev.pieces.map((p) => {
        if (p.id === movingPieceId) {
          return { ...p, locked: toSlot === p.correctIndex };
        }
        if (p.id === targetPieceId) {
          return { ...p, locked: fromSlot === p.correctIndex };
        }
        return p;
      });

      changed = true;
      return { ...prev, slots: nextSlots, pieces: nextPieces };
    });

    if (changed) setMoves((m) => m + 1);
    return changed;
  }, []);

  const solved = useMemo(() => isSolved(model), [model]);

  return { model, moves, shuffle, movePiece, solved };
}

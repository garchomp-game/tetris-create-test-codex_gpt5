import { create } from 'zustand';
import { TetrominoType, NEXT_PIECES_COUNT } from '@/types/tetris';
import { sevenBag } from '@/organisms/sevenBag';

export interface QueuedPiece {
  id: string;
  type: TetrominoType;
}

interface PieceStore {
  current: TetrominoType | null;
  queue: QueuedPiece[];
  previewCount: number;
  initialized: boolean;
  reset: (previewCount?: number) => void;
  spawnNext: () => TetrominoType | null;
}

let idCounter = 0;
const nextId = () => `${++idCounter}`;

function fillQueue(queue: QueuedPiece[], previewCount: number): QueuedPiece[] {
  const out = queue.slice();
  while (out.length < previewCount) {
    out.push({ id: nextId(), type: sevenBag.next() });
  }
  return out;
}

export const usePieceStore = create<PieceStore>((set, get) => ({
  current: null,
  queue: [],
  previewCount: NEXT_PIECES_COUNT,
  initialized: false,
  reset: (previewCount = get().previewCount) => {
    sevenBag.reset();
    const current = sevenBag.next();
    const queue = fillQueue([], previewCount);
    set({ current, queue, previewCount, initialized: true });
  },
  spawnNext: () => {
    const { queue, previewCount, initialized } = get();
    if (!initialized) return null;
    const next = queue[0]?.type ?? sevenBag.next();
    const rest = fillQueue(queue.slice(1), previewCount);
    set({ current: next, queue: rest });
    return next;
  },
}));


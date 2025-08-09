import { create } from 'zustand';
import { TetrominoType, NEXT_PIECES_COUNT } from '@/types/tetris';
import { sevenBag } from '@/organisms/sevenBag';

interface PieceStore {
  current: TetrominoType | null;
  queue: TetrominoType[];
  preview: number;
  initialized: boolean;
  reset: (preview?: number) => void;
  spawnNext: () => TetrominoType | null;
}

function fillQueue(queue: TetrominoType[], preview: number): TetrominoType[] {
  const out = queue.slice();
  while (out.length < preview) {
    out.push(sevenBag.next());
  }
  return out;
}

export const usePieceStore = create<PieceStore>((set, get) => ({
  current: null,
  queue: [],
  preview: NEXT_PIECES_COUNT,
  initialized: false,
  reset: (preview = get().preview) => {
    sevenBag.reset();
    const current = sevenBag.next();
    const queue = fillQueue([], preview);
    set({ current, queue, preview, initialized: true });
  },
  spawnNext: () => {
    const { queue, preview, initialized } = get();
    if (!initialized) return null;
    const next = queue[0] ?? sevenBag.next();
    const rest = fillQueue(queue.slice(1), preview);
    set({ current: next, queue: rest });
    return next;
  },
}));


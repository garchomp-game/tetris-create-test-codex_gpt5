import { TetrominoType } from '@/types/tetris';

const ALL: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

function fyShuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

class SevenBag {
  private bag: TetrominoType[] = [];
  private rnd: () => number;

  constructor(rnd: () => number = Math.random) {
    this.rnd = rnd;
    this.refill();
  }

  private refill() {
    this.bag = fyShuffle(ALL, this.rnd);
  }

  next(): TetrominoType {
    if (this.bag.length === 0) this.refill();
    return this.bag.pop()!;
  }

  reset() {
    this.bag = [];
    this.refill();
  }
}

export const sevenBag = new SevenBag();

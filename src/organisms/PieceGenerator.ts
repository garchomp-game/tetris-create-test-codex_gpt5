import { TetrominoType } from '@/types/tetris';
import { TETROMINO_TYPES } from '@/utils/tetrominos';
import { shufflePieces } from '@/molecules/shufflePieces';

export class PieceGenerator {
  private bag: TetrominoType[] = [];

  reset() {
    this.bag = [];
  }

  getNextPiece(): TetrominoType {
    if (this.bag.length === 0) {
      this.bag = shufflePieces(TETROMINO_TYPES);
    }
    return this.bag.pop()!;
  }
}

export const pieceGenerator = new PieceGenerator();

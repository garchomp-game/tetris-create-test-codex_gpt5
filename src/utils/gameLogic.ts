import { 
  GameState, 
  Tetromino, 
  TetrominoType, 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  NEXT_PIECES_COUNT 
} from '@/types/tetris';
import { getRandomTetromino } from '@/utils/tetrominos';

export function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function isValidPosition(
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): boolean {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = tetromino.position.x + x;
        const newY = tetromino.position.y + y;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placeTetromino(
  board: (TetrominoType | null)[][],
  tetromino: Tetromino
): (TetrominoType | null)[][] {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = tetromino.position.x + x;
        const newY = tetromino.position.y + y;
        if (newY >= 0) {
          newBoard[newY][newX] = tetromino.type;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: (TetrominoType | null)[][]): {
  newBoard: (TetrominoType | null)[][];
  linesCleared: number;
} {
  const fullLines: number[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      fullLines.push(y);
    }
  }

  if (fullLines.length === 0) {
    return { newBoard: board, linesCleared: 0 };
  }

  const newBoard = board.filter((_, index) => !fullLines.includes(index));
  
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared: fullLines.length };
}

export function generateNextPieces(): TetrominoType[] {
  const pieces: TetrominoType[] = [];
  for (let i = 0; i < NEXT_PIECES_COUNT; i++) {
    pieces.push(getRandomTetromino());
  }
  return pieces;
}

export function calculateScore(linesCleared: number, level: number): number {
  const baseScore = [0, 40, 100, 300, 1200];
  return baseScore[linesCleared] * (level + 1);
}

export function calculateLevel(lines: number): number {
  return Math.floor(lines / 10);
}

export function getDropSpeed(level: number): number {
  return Math.max(50, 1000 - (level * 50));
}

export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentPiece: null,
    nextPieces: generateNextPieces(),
    holdPiece: null,
    canHold: true,
    score: 0,
    level: 0,
    lines: 0,
    gameOver: false,
    paused: false,
    started: false
  };
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  GameState,
  Tetromino,
  TetrominoType,
  NEXT_PIECES_COUNT,
} from '@/types/tetris';
import {
  createInitialGameState,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed,
} from '@/utils/gameLogic';
import { createTetromino, rotateTetromino } from '@/utils/tetrominos';
import { usePieceQueue } from './usePieceQueue';

export function useGameLogic() {
  const { current, nextQueue, spawnNext, hardReset } = usePieceQueue(
    NEXT_PIECES_COUNT
  );
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState()
  );
  const dropTimeRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);

  const movePiece = useCallback((dx: number, dy: number) => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      const newPiece = {
        ...prevState.currentPiece,
        position: {
          x: prevState.currentPiece.position.x + dx,
          y: prevState.currentPiece.position.y + dy,
        },
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece,
        };
      }

      return prevState;
    });
  }, []);

  const rotatePiece = useCallback((clockwise: boolean = true) => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      const rotatedPiece = rotateTetromino(prevState.currentPiece, clockwise);

      if (isValidPosition(prevState.board, rotatedPiece)) {
        return {
          ...prevState,
          currentPiece: rotatedPiece,
        };
      }

      return prevState;
    });
  }, []);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused) return;
    const nextType = spawnNext();
    setGameState(prevState => {
      let dropDistance = 0;
      let testPiece = { ...prevState.currentPiece! };

      while (true) {
        const nextPosition = {
          ...testPiece,
          position: { x: testPiece.position.x, y: testPiece.position.y + 1 },
        };

        if (isValidPosition(prevState.board, nextPosition)) {
          testPiece = nextPosition;
          dropDistance++;
        } else {
          break;
        }
      }

      const newBoard = placeTetromino(prevState.board, testPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore =
        prevState.score + calculateScore(linesCleared, newLevel) + dropDistance * 2;

      const newCurrentPiece = createTetromino(nextType);
      const gameOver = !isValidPosition(clearedBoard, newCurrentPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : newCurrentPiece,
        canHold: true,
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver,
      };
    });
  }, [gameState.currentPiece, gameState.gameOver, gameState.paused, spawnNext]);

  const softDrop = useCallback(() => {
    movePiece(0, 1);
  }, [movePiece]);

  const holdPiece = useCallback(() => {
    if (
      !gameState.currentPiece ||
      !gameState.canHold ||
      gameState.gameOver ||
      gameState.paused
    )
      return;

    let replacement: TetrominoType | undefined;
    if (!gameState.holdPiece) {
      replacement = spawnNext();
    }

    setGameState(prevState => {
      let newCurrentPiece: Tetromino;
      let newHoldPiece: TetrominoType;

      if (prevState.holdPiece) {
        newCurrentPiece = createTetromino(prevState.holdPiece);
        newHoldPiece = prevState.currentPiece!.type;
      } else {
        newCurrentPiece = createTetromino(replacement!);
        newHoldPiece = prevState.currentPiece!.type;
      }

      return {
        ...prevState,
        currentPiece: newCurrentPiece,
        holdPiece: newHoldPiece,
        canHold: false,
      };
    });
  }, [gameState, spawnNext]);

  const dropPiece = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused) return;
    setGameState(prevState => {
      const newPiece = {
        ...prevState.currentPiece!,
        position: {
          x: prevState.currentPiece!.position.x,
          y: prevState.currentPiece!.position.y + 1,
        },
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece,
        };
      }

      const nextType = spawnNext();
      const newBoard = placeTetromino(prevState.board, prevState.currentPiece!);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);

      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, newLevel);

      const newCurrentPiece = createTetromino(nextType);
      const gameOver = !isValidPosition(clearedBoard, newCurrentPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : newCurrentPiece,
        canHold: true,
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver,
      };
    });
  }, [gameState.currentPiece, gameState.gameOver, gameState.paused, spawnNext]);

  const resetGame = useCallback(() => {
    hardReset();
    setGameState(createInitialGameState());
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    dropTimeRef.current = 0;
  }, [hardReset]);

  const startGame = useCallback(() => {
    if (gameState.started) return;
    setGameState(prevState => ({
      ...prevState,
      currentPiece: createTetromino(current),
      started: true,
      paused: false,
      gameOver: false,
    }));
    spawnNext();
    dropTimeRef.current = Date.now();
  }, [gameState.started, current, spawnNext]);

  const togglePause = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.started || prevState.gameOver) return prevState;
      return { ...prevState, paused: !prevState.paused };
    });
  }, []);

  useEffect(() => {
    if (!gameState.started) return;
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - dropTimeRef.current;
      const dropInterval = getDropSpeed(gameState.level);

      if (deltaTime > dropInterval && !gameState.paused && !gameState.gameOver) {
        dropPiece();
        dropTimeRef.current = now;
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.started, gameState.level, gameState.paused, gameState.gameOver, dropPiece]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (event.key.toLowerCase() === 'r') {
          resetGame();
          startGame();
        }
        return;
      }

      if (!gameState.started) return;

      switch (event.key.toLowerCase()) {
        case 'a':
          movePiece(-1, 0);
          break;
        case 'd':
          movePiece(1, 0);
          break;
        case 's':
          softDrop();
          break;
        case ' ':
          event.preventDefault();
          hardDrop();
          break;
        case 'arrowup':
          event.preventDefault();
          rotatePiece(true);
          break;
        case 'arrowdown':
          event.preventDefault();
          rotatePiece(false);
          break;
        case 'arrowleft':
          event.preventDefault();
          rotatePiece(false);
          break;
        case 'arrowright':
          event.preventDefault();
          rotatePiece(true);
          break;
        case 'c':
          holdPiece();
          break;
        case 'p':
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    movePiece,
    softDrop,
    hardDrop,
    rotatePiece,
    holdPiece,
    togglePause,
    resetGame,
    startGame,
    gameState.gameOver,
    gameState.started,
  ]);

  return { gameState, nextPieces: nextQueue, resetGame, startGame, togglePause };
}

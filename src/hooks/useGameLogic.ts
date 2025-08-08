'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Tetromino, TetrominoType, NEXT_PIECES_COUNT } from '@/types/tetris';
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
  import { useGameStore } from '@/store/game';

export function useGameLogic() {
  const { current, nextQueue, spawnNext, hardReset, isHydrated } = usePieceQueue(
    NEXT_PIECES_COUNT
  );
    const gameState = useGameStore(state => state.gameState);
    const setGameState = useGameStore(state => state.setGameState);
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
    }, [setGameState]);

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
    }, [setGameState]);

  const hardDrop = useCallback(() => {
    if (!gameState.currentPiece || gameState.gameOver || gameState.paused || !isHydrated) return;
    const nextType = spawnNext();
    if (!nextType) return;
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
    }, [gameState.currentPiece, gameState.gameOver, gameState.paused, spawnNext, setGameState]);

  const softDrop = useCallback(() => {
    movePiece(0, 1);
  }, [movePiece]);

  const holdPiece = useCallback(() => {
    if (
      !gameState.currentPiece ||
      !gameState.canHold ||
      gameState.gameOver ||
      gameState.paused ||
      !isHydrated
    )
      return;

    let replacement: TetrominoType | null | undefined;
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
        if (!replacement) return prevState;
        newCurrentPiece = createTetromino(replacement);
        newHoldPiece = prevState.currentPiece!.type;
      }

      return {
        ...prevState,
        currentPiece: newCurrentPiece,
        holdPiece: newHoldPiece,
        canHold: false,
      };
    });
    }, [gameState, spawnNext, setGameState]);

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
      if (!nextType) return prevState;
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
    }, [gameState.currentPiece, gameState.gameOver, gameState.paused, spawnNext, setGameState]);

  const resetGame = useCallback(() => {
    hardReset();
    setGameState(createInitialGameState());
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    dropTimeRef.current = 0;
  }, [hardReset, setGameState]);

  const restartGame = useCallback(() => {
    if (!isHydrated) return;
    resetGame();
    // hardReset後の新しいcurrentを取得するため、少し遅延して実行
    setTimeout(() => {
      if (!current) return;
      setGameState(prevState => ({
        ...prevState,
        currentPiece: createTetromino(current),
        started: true,
        paused: false,
        gameOver: false,
      }));
      dropTimeRef.current = Date.now();
    }, 0);
  }, [resetGame, current, setGameState, isHydrated]);

  const startGame = useCallback(() => {
    if (gameState.started || !isHydrated || !current) return;
    setGameState(prevState => ({
      ...prevState,
      currentPiece: createTetromino(current),
      started: true,
      paused: false,
      gameOver: false,
    }));
    dropTimeRef.current = Date.now();
    }, [gameState.started, current, setGameState, isHydrated]);

  const togglePause = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.started || prevState.gameOver) return prevState;
      return { ...prevState, paused: !prevState.paused };
    });
    }, [setGameState]);

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
          restartGame();
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
    restartGame,
    startGame,
    gameState.gameOver,
    gameState.started,
  ]);

    return { nextPieces: nextQueue, resetGame, restartGame, startGame, togglePause };
}

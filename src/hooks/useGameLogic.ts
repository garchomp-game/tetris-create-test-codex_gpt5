'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  GameState, 
  Tetromino, 
  Position, 
  TetrominoType 
} from '@/types/tetris';
import {
  createInitialGameState,
  isValidPosition,
  placeTetromino,
  clearLines,
  calculateScore,
  calculateLevel,
  getDropSpeed
} from '@/utils/gameLogic';
import { 
  createTetromino, 
  rotateTetromino, 
  getRandomTetromino 
} from '@/utils/tetrominos';

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());
  const [lastDropTime, setLastDropTime] = useState(Date.now());
  const dropTimeRef = useRef(lastDropTime);
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
          y: prevState.currentPiece.position.y + dy
        }
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece
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
          currentPiece: rotatedPiece
        };
      }

      return prevState;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      let dropDistance = 0;
      let testPiece = { ...prevState.currentPiece };

      while (true) {
        const nextPosition = {
          ...testPiece,
          position: { x: testPiece.position.x, y: testPiece.position.y + 1 }
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
      const newScore = prevState.score + calculateScore(linesCleared, newLevel) + dropDistance * 2;

      const nextPiece = prevState.nextPieces[0];
      const newNextPieces = [...prevState.nextPieces.slice(1), getRandomTetromino()];
      const newCurrentPiece = createTetromino(nextPiece);

      const gameOver = !isValidPosition(clearedBoard, newCurrentPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : newCurrentPiece,
        nextPieces: newNextPieces,
        canHold: true,
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver
      };
    });
  }, []);

  const softDrop = useCallback(() => {
    movePiece(0, 1);
  }, [movePiece]);

  const holdPiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || !prevState.canHold || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      let newCurrentPiece: Tetromino;
      let newHoldPiece: TetrominoType;
      let newNextPieces = prevState.nextPieces;

      if (prevState.holdPiece) {
        newCurrentPiece = createTetromino(prevState.holdPiece);
        newHoldPiece = prevState.currentPiece.type;
      } else {
        const nextPiece = prevState.nextPieces[0];
        newCurrentPiece = createTetromino(nextPiece);
        newNextPieces = [...prevState.nextPieces.slice(1), getRandomTetromino()];
        newHoldPiece = prevState.currentPiece.type;
      }

      return {
        ...prevState,
        currentPiece: newCurrentPiece,
        holdPiece: newHoldPiece,
        nextPieces: newNextPieces,
        canHold: false
      };
    });
  }, []);

  const dropPiece = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.currentPiece || prevState.gameOver || prevState.paused) {
        return prevState;
      }

      const newPiece = {
        ...prevState.currentPiece,
        position: {
          x: prevState.currentPiece.position.x,
          y: prevState.currentPiece.position.y + 1
        }
      };

      if (isValidPosition(prevState.board, newPiece)) {
        return {
          ...prevState,
          currentPiece: newPiece
        };
      }

      // Place the piece
      const newBoard = placeTetromino(prevState.board, prevState.currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      const newLines = prevState.lines + linesCleared;
      const newLevel = calculateLevel(newLines);
      const newScore = prevState.score + calculateScore(linesCleared, newLevel);

      const nextPiece = prevState.nextPieces[0];
      const newNextPieces = [...prevState.nextPieces.slice(1), getRandomTetromino()];
      const newCurrentPiece = createTetromino(nextPiece);

      const gameOver = !isValidPosition(clearedBoard, newCurrentPiece);

      return {
        ...prevState,
        board: clearedBoard,
        currentPiece: gameOver ? null : newCurrentPiece,
        nextPieces: newNextPieces,
        canHold: true,
        score: newScore,
        level: newLevel,
        lines: newLines,
        gameOver
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    setLastDropTime(Date.now());
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      paused: !prevState.paused
    }));
  }, []);

  // Game loop
  useEffect(() => {
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
  }, [gameState.level, gameState.paused, gameState.gameOver, dropPiece]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameOver) return;

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
        case 'r':
          if (gameState.gameOver) {
            resetGame();
          }
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
    gameState.gameOver
  ]);

  return {
    gameState,
    resetGame,
    togglePause
  };
}

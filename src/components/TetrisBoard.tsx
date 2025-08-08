'use client';

import React from 'react';
import { TetrominoType, Tetromino } from '@/types/tetris';
import { TETROMINO_COLORS } from '@/utils/tetrominos';

interface TetrisBlockProps {
  type: TetrominoType | null;
  ghost?: boolean;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({ type, ghost }) => {
  const getBlockStyle = () => {
    if (!type) {
      return 'bg-gray-900 border border-gray-700';
    }

    const baseStyle = 'border border-gray-400';
    
    if (ghost) {
      return `${baseStyle} border-2 border-dashed opacity-30`;
    }

    return `${baseStyle} shadow-sm`;
  };

  const getBlockColor = () => {
    if (!type) return '';
    return TETROMINO_COLORS[type];
  };

  return (
    <div 
      className={`w-6 h-6 ${getBlockStyle()}`}
      style={{
        backgroundColor: type ? getBlockColor() : undefined
      }}
    />
  );
};

interface TetrisBoardProps {
  board: (TetrominoType | null)[][];
  currentPiece: Tetromino | null;
  showGhost?: boolean;
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ 
  board, 
  currentPiece, 
  showGhost = true 
}) => {
  // Create a copy of the board to render
  const renderBoard = board.map(row => [...row]);

  // Add ghost piece
  let ghostPiece: Tetromino | null = null;
  if (currentPiece && showGhost) {
    ghostPiece = { ...currentPiece };
    
    // Find the lowest valid position for the ghost
    while (ghostPiece) {
      const testPiece: Tetromino = {
        ...ghostPiece,
        position: { x: ghostPiece.position.x, y: ghostPiece.position.y + 1 }
      };
      
      // Check if the test position is valid
      let isValid = true;
      for (let y = 0; y < testPiece.shape.length; y++) {
        for (let x = 0; x < testPiece.shape[y].length; x++) {
          if (testPiece.shape[y][x]) {
            const newX = testPiece.position.x + x;
            const newY = testPiece.position.y + y;
            
            if (
              newX < 0 ||
              newX >= renderBoard[0].length ||
              newY >= renderBoard.length ||
              (newY >= 0 && renderBoard[newY][newX])
            ) {
              isValid = false;
              break;
            }
          }
        }
        if (!isValid) break;
      }
      
      if (isValid) {
        ghostPiece = testPiece;
      } else {
        break;
      }
    }
  }

  // Add ghost piece to render board
  if (ghostPiece && ghostPiece.position.y !== currentPiece?.position.y) {
    for (let y = 0; y < ghostPiece.shape.length; y++) {
      for (let x = 0; x < ghostPiece.shape[y].length; x++) {
        if (ghostPiece.shape[y][x]) {
          const newX = ghostPiece.position.x + x;
          const newY = ghostPiece.position.y + y;
          if (newY >= 0 && newY < renderBoard.length && newX >= 0 && newX < renderBoard[0].length) {
            if (!renderBoard[newY][newX]) {
              renderBoard[newY][newX] = currentPiece!.type;
            }
          }
        }
      }
    }
  }

  // Add current piece to render board
  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const newX = currentPiece.position.x + x;
          const newY = currentPiece.position.y + y;
          if (newY >= 0 && newY < renderBoard.length && newX >= 0 && newX < renderBoard[0].length) {
            renderBoard[newY][newX] = currentPiece.type;
          }
        }
      }
    }
  }

  return (
    <div className="inline-block border-2 border-gray-300 bg-black p-1">
      <div className="grid grid-cols-10 gap-0">
        {renderBoard.map((row, y) =>
          row.map((cell, x) => {
            const isGhost = ghostPiece && 
              ghostPiece.position.y !== currentPiece?.position.y &&
              y >= ghostPiece.position.y && 
              y < ghostPiece.position.y + ghostPiece.shape.length &&
              x >= ghostPiece.position.x && 
              x < ghostPiece.position.x + ghostPiece.shape[0].length &&
              ghostPiece.shape[y - ghostPiece.position.y] &&
              ghostPiece.shape[y - ghostPiece.position.y][x - ghostPiece.position.x] &&
              !board[y][x];

            return (
              <TetrisBlock 
                key={`${x}-${y}`} 
                type={cell} 
                ghost={Boolean(isGhost)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default TetrisBoard;

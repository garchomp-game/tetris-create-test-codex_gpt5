'use client';

import React from 'react';
import TetrisBoard from '@/components/TetrisBoard';
import { NextPieces, HoldPiece } from '@/components/TetrominoPreview';
import GameInfo from '@/components/GameInfo';
import Controls from '@/components/Controls';
import { useGameLogic } from '@/hooks/useGameLogic';

const TetrisGame: React.FC = () => {
  const { gameState, resetGame, togglePause } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tetris
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left panel - Hold and Controls */}
          <div className="space-y-4">
            <HoldPiece 
              holdPiece={gameState.holdPiece} 
              canHold={gameState.canHold} 
            />
            <Controls />
          </div>
          
          {/* Center - Game Board */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="mb-4">
              <TetrisBoard
                board={gameState.board}
                currentPiece={gameState.currentPiece}
                showGhost={true}
              />
            </div>
            
            {/* Game controls */}
            <div className="flex gap-4">
              <button
                onClick={togglePause}
                disabled={gameState.gameOver}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {gameState.paused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                New Game
              </button>
            </div>
          </div>
          
          {/* Right panel - Next pieces and Game info */}
          <div className="space-y-4">
            <NextPieces nextPieces={gameState.nextPieces} />
            <GameInfo
              score={gameState.score}
              level={gameState.level}
              lines={gameState.lines}
              gameOver={gameState.gameOver}
              paused={gameState.paused}
            />
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Use keyboard controls to play. Focus on the game area and use the keys shown in the Controls panel.</p>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;

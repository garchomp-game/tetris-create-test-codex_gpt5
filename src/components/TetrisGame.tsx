'use client';

import React from 'react';
import TetrisBoard from '@/components/TetrisBoard';
import { NextPieces, HoldPiece } from '@/components/TetrominoPreview';
import GameInfo from '@/components/GameInfo';
import Controls from '@/components/Controls';
import { useGameLogic } from '@/hooks/useGameLogic';
import ThemeToggle from '@/components/ui/ThemeToggle';

const TetrisGame: React.FC = () => {
  const { gameState, resetGame, startGame, togglePause } = useGameLogic();

  const handleNewGame = () => {
    resetGame();
    startGame();
  };

  return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-center">Tetris</h1>
            <ThemeToggle />
          </div>
        
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
                {!gameState.started ? (
                  <button
                    onClick={startGame}
                    className="px-4 py-2 rounded text-white hover:brightness-110"
                    style={{ backgroundColor: 'var(--color-success)' }}
                  >
                    Start
                  </button>
                ) : (
                  <>
                    <button
                      onClick={togglePause}
                      disabled={gameState.gameOver}
                      className="px-4 py-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      {gameState.paused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={handleNewGame}
                      className="px-4 py-2 rounded text-white hover:brightness-110"
                      style={{ backgroundColor: 'var(--color-success)' }}
                    >
                      New Game
                    </button>
                  </>
                )}
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
              started={gameState.started}
            />
          </div>
        </div>
        
        {/* Instructions */}
          <div className="mt-8 text-center text-secondary text-sm">
            <p>Use keyboard controls to play. Focus on the game area and use the keys shown in the Controls panel.</p>
          </div>
        </div>
      </div>
    );
};

export default TetrisGame;

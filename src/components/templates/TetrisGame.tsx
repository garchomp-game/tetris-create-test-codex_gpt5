'use client';

import React from 'react';
import TetrisBoard from '@/components/organisms/TetrisBoard';
import NextPieces from '@/components/molecules/NextPieces';
import HoldPiece from '@/components/molecules/HoldPiece';
import GameInfo from '@/components/molecules/GameInfo';
import Controls from '@/components/molecules/Controls';
import ThemeToggle from '@/components/molecules/ThemeToggle';
import { Button } from '@/components/atoms/Button';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGameStore } from '@/store/game';
import { useSettingsStore } from '@/store/settings';

const TetrisGame: React.FC = () => {
  const { nextPieces, resetGame, startGame, togglePause } = useGameLogic();
  const gameState = useGameStore(state => state.gameState);
  const showGhost = useSettingsStore(state => state.showGhost);

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
                showGhost={showGhost}
              />
            </div>
            
            {/* Game controls */}
            <div className="flex gap-4">
              {!gameState.started ? (
                <Button variant="primary" onClick={startGame}>
                  Start
                </Button>
              ) : (
                <>
                  <Button
                    onClick={togglePause}
                    disabled={gameState.gameOver}
                  >
                    {gameState.paused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button variant="primary" onClick={handleNewGame}>
                    New Game
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {/* Right panel - Next pieces and Game info */}
          <div className="space-y-4">
            <NextPieces nextPieces={nextPieces} />
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

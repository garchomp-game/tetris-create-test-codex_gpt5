'use client';

import React from 'react';

interface GameInfoProps {
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ 
  score, 
  level, 
  lines, 
  gameOver, 
  paused 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-center">Game Info</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Score:</span>
          <span className="font-mono text-lg">{score.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Level:</span>
          <span className="font-mono text-lg">{level}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Lines:</span>
          <span className="font-mono text-lg">{lines}</span>
        </div>

        {(gameOver || paused) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            {gameOver && (
              <div className="text-center">
                <p className="text-red-600 font-bold text-lg mb-2">Game Over!</p>
                <p className="text-sm text-gray-600">Press R to restart</p>
              </div>
            )}
            {paused && !gameOver && (
              <div className="text-center">
                <p className="text-yellow-600 font-bold text-lg mb-2">Paused</p>
                <p className="text-sm text-gray-600">Press P to resume</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo;

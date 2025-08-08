'use client';

import React from 'react';
import Panel from '@/components/ui/Panel';

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
      <Panel title="Game Info">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-secondary">Score:</span>
            <span className="font-mono text-lg">{score.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-secondary">Level:</span>
            <span className="font-mono text-lg">{level}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-secondary">Lines:</span>
            <span className="font-mono text-lg">{lines}</span>
          </div>

          {(gameOver || paused) && (
            <div className="mt-4 pt-3 border-t border-[var(--color-panel-border)]">
              {gameOver && (
                <div className="text-center">
                  <p className="text-[var(--color-danger)] font-bold text-lg mb-2">Game Over!</p>
                  <p className="text-sm text-secondary">Press R to restart</p>
                </div>
              )}
              {paused && !gameOver && (
                <div className="text-center">
                  <p className="text-[var(--color-warning)] font-bold text-lg mb-2">Paused</p>
                  <p className="text-sm text-secondary">Press P to resume</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Panel>
    );
};

export default GameInfo;

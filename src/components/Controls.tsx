'use client';

import React from 'react';

const Controls: React.FC = () => {
  const controls = [
    { key: 'A', action: 'Move Left' },
    { key: 'D', action: 'Move Right' },
    { key: 'S', action: 'Soft Drop' },
    { key: 'Space', action: 'Hard Drop' },
    { key: '↑/→', action: 'Rotate Clockwise' },
    { key: '↓/←', action: 'Rotate Counter-clockwise' },
    { key: 'C', action: 'Hold Piece' },
    { key: 'P', action: 'Pause/Resume' },
    { key: 'R', action: 'Restart (when game over)' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3 text-center">Controls</h2>
      
      <div className="space-y-2">
        {controls.map(({ key, action }, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="font-mono bg-gray-100 px-2 py-1 rounded border">
              {key}
            </span>
            <span className="text-gray-700">{action}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controls;

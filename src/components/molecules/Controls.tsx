'use client';

import React from 'react';
import Panel from '@/components/atoms/Panel';
import { Button } from '@/components/atoms/Button';
import { useSettingsStore } from '@/store/settings';

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
  const { showGhost, toggleGhost } = useSettingsStore();

  return (
    <Panel title="Controls">
      <div className="space-y-2">
        {controls.map(({ key, action }, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="font-mono bg-[var(--color-bg)] px-2 py-1 rounded border border-[var(--color-panel-border)]">
              {key}
            </span>
            <span className="text-secondary">{action}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="outline" size="sm" onClick={toggleGhost}>
          {showGhost ? 'Hide Ghost' : 'Show Ghost'}
        </Button>
      </div>
    </Panel>
  );
};

export default Controls;

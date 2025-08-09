'use client';

import React from 'react';
import Panel from '@/components/atoms/Panel';
import TetrominoPreview from './TetrominoPreview';
import { usePieceStore } from '@/store/pieceQueue';

const NextPieces: React.FC = () => {
  const nextPieces = usePieceStore(state => state.queue);
  return (
    <Panel title="Next">
      <div className="space-y-2">
        {nextPieces.map((piece, index) => (
          <TetrominoPreview
            key={index}
            type={piece}
            title={`${index + 1}`}
            small={index > 0}
          />
        ))}
      </div>
    </Panel>
  );
};

export default NextPieces;

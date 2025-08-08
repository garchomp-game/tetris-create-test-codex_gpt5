'use client';

import React from 'react';
import { TetrominoType } from '@/types/tetris';
import Panel from '@/components/atoms/Panel';
import TetrominoPreview from './TetrominoPreview';

interface HoldPieceProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
}

const HoldPiece: React.FC<HoldPieceProps> = ({ holdPiece, canHold }) => (
  <Panel title="Hold" className={!canHold ? 'opacity-50' : ''}>
    <TetrominoPreview type={holdPiece} title="" />
    {!canHold && (
      <p className="text-xs text-secondary text-center mt-2">Used</p>
    )}
  </Panel>
);

export default HoldPiece;

'use client';

import React from 'react';
import { TetrominoType } from '@/types/tetris';
import { TETROMINO_SHAPES, TETROMINO_COLORS } from '@/utils/tetrominos';
import Panel from '@/components/ui/Panel';

interface TetrominoPreviewProps {
  type: TetrominoType | null;
  title: string;
  small?: boolean;
}

const TetrominoPreview: React.FC<TetrominoPreviewProps> = ({ 
  type, 
  title, 
  small = false 
}) => {
  const blockSize = small ? 'w-3 h-3' : 'w-4 h-4';
  const containerSize = small ? 'w-16 h-12' : 'w-20 h-16';

  const renderPreview = () => {
    if (!type) {
        return (
          <div className={`${containerSize} border border-[var(--color-panel-border)] bg-[var(--color-bg)] flex items-center justify-center`}>
            <span className="text-secondary text-xs">Empty</span>
          </div>
        );
    }

    const shape = TETROMINO_SHAPES[type][0];
    const color = TETROMINO_COLORS[type];

    // Find the bounding box of the shape
    let minX = shape[0].length, maxX = -1, minY = shape.length, maxY = -1;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return (
        <div className={`${containerSize} border border-[var(--board-border)] bg-[var(--board-bg)] flex items-center justify-center p-1`}>
        <div 
          className="grid gap-0"
          style={{ 
            gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`
          }}
        >
          {Array(height).fill(null).map((_, y) =>
            Array(width).fill(null).map((_, x) => {
              const shapeY = y + minY;
              const shapeX = x + minX;
              const hasBlock = shape[shapeY] && shape[shapeY][shapeX];
              
              return (
                <div
                  key={`${x}-${y}`}
                    className={`${blockSize} ${hasBlock ? 'border border-[var(--board-border)]' : ''}`}
                  style={{
                    backgroundColor: hasBlock ? color : 'transparent'
                  }}
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
      <div className="flex flex-col items-center mb-2">
        <h3 className="text-sm font-semibold mb-1 text-secondary">{title}</h3>
      {renderPreview()}
    </div>
  );
};

interface NextPiecesProps {
  nextPieces: TetrominoType[];
}

  export const NextPieces: React.FC<NextPiecesProps> = ({ nextPieces }) => {
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

interface HoldPieceProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
}

  export const HoldPiece: React.FC<HoldPieceProps> = ({ holdPiece, canHold }) => {
    return (
      <Panel title="Hold" className={!canHold ? 'opacity-50' : ''}>
        <TetrominoPreview
          type={holdPiece}
          title=""
        />
        {!canHold && (
          <p className="text-xs text-secondary text-center mt-2">
            Used
          </p>
        )}
      </Panel>
    );
  };

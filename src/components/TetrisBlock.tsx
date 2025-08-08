import React from 'react';
import { TetrominoType } from '@/types/tetris';
import { TETROMINO_COLORS } from '@/utils/tetrominos';

interface TetrisBlockProps {
  type: TetrominoType | null;
  ghost?: boolean;
}

const TetrisBlock: React.FC<TetrisBlockProps> = ({ type, ghost }) => {
  const getBlockStyle = () => {
    if (!type) {
      return 'bg-[var(--board-bg)] border border-[var(--board-border)]';
    }

    const baseStyle = 'border border-[var(--board-border)]';

    if (ghost) {
      return `${baseStyle} border-2 border-dashed opacity-30`;
    }

    return `${baseStyle} shadow-sm`;
  };

  const getBlockColor = () => {
    if (!type) return '';
    return TETROMINO_COLORS[type];
  };

  return (
    <div
      className={`w-6 h-6 ${getBlockStyle()}`}
      style={{
        backgroundColor: type ? getBlockColor() : undefined
      }}
    />
  );
};

export default TetrisBlock;

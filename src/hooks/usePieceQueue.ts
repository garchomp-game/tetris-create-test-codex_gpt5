'use client';

import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { sevenBag } from '@/organisms/sevenBag';
import { TetrominoType } from '@/types/tetris';

type State = {
  queue: TetrominoType[];
  current: TetrominoType | null;
};

type Action =
  | { type: 'CONSUME_ONE'; preview: number; piece: TetrominoType }
  | { type: 'HARD_RESET'; preview: number };

function fillQueue(q: TetrominoType[], need: number): TetrominoType[] {
  const out = q.slice();
  while (out.length < need) out.push(sevenBag.next());
  return out;
}

function init(preview: number): State {
  // SSRの問題を回避するため、初期状態はnullにする
  return { current: null, queue: [] };
}

function reducer(state: State, action: Action): State {
  const preview = action.preview;
  switch (action.type) {
    case 'CONSUME_ONE': {
      const nextCurrent = action.piece;
      const rest = state.queue.slice(1);
      const queue = fillQueue(rest, preview);
      return { current: nextCurrent, queue };
    }
    case 'HARD_RESET': {
      const current = sevenBag.next();
      const queue = fillQueue([], preview);
      return { current, queue };
    }
    default:
      return state;
  }
}

export function usePieceQueue(preview = 5) {
  const [state, dispatch] = useReducer(reducer, preview, init);
  const [isHydrated, setIsHydrated] = useState(false);
  const initialized = useRef(false);

  // ハイドレーション完了後にピースを初期化
  useEffect(() => {
    setIsHydrated(true);
    if (!initialized.current) {
      initialized.current = true;
      sevenBag.reset();
      dispatch({ type: 'HARD_RESET', preview });
    }
  }, [preview]);

  useEffect(() => {
    if (initialized.current && isHydrated) {
      dispatch({ type: 'HARD_RESET', preview });
    }
  }, [preview, isHydrated]);

  const spawnNext = useCallback((): TetrominoType | null => {
    if (!isHydrated || !state.current) return null;
    const piece = state.queue[0] ?? sevenBag.next();
    dispatch({ type: 'CONSUME_ONE', preview, piece });
    return piece;
  }, [state.queue, state.current, preview, isHydrated]);

  const hardReset = useCallback(() => {
    if (!isHydrated) return;
    sevenBag.reset();
    dispatch({ type: 'HARD_RESET', preview });
  }, [preview, isHydrated]);

  return {
    current: state.current,
    nextQueue: isHydrated ? state.queue : [],
    spawnNext,
    hardReset,
    isHydrated,
  };
}

'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { sevenBag } from '@/organisms/sevenBag';
import { TetrominoType } from '@/types/tetris';

type State = {
  queue: TetrominoType[];
  current: TetrominoType;
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
  const current = sevenBag.next();
  const queue = fillQueue([], preview);
  return { current, queue };
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
      return init(preview);
    }
    default:
      return state;
  }
}

export function usePieceQueue(preview = 5) {
  const [state, dispatch] = useReducer(reducer, preview, init);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      dispatch({ type: 'HARD_RESET', preview });
    } else {
      initialized.current = true;
    }
  }, [preview]);

  const spawnNext = useCallback((): TetrominoType => {
    const piece = state.queue[0] ?? sevenBag.next();
    dispatch({ type: 'CONSUME_ONE', preview, piece });
    return piece;
  }, [state.queue, preview]);

  const hardReset = useCallback(() => {
    dispatch({ type: 'HARD_RESET', preview });
  }, [preview]);

  return {
    current: state.current,
    nextQueue: state.queue,
    spawnNext,
    hardReset,
  };
}

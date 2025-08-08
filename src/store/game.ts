import { create } from 'zustand';
import { GameState } from '@/types/tetris';
import { createInitialGameState } from '@/utils/gameLogic';

interface GameStore {
  gameState: GameState;
  setGameState: (
    updater: ((state: GameState) => GameState) | GameState
  ) => void;
}

export const useGameStore = create<GameStore>(set => ({
  gameState: createInitialGameState(),
  setGameState: updater =>
    set(state => ({
      gameState:
        typeof updater === 'function'
          ? (updater as (state: GameState) => GameState)(state.gameState)
          : updater,
    })),
}));

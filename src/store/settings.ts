import { create } from 'zustand';

interface SettingsState {
  showGhost: boolean;
  toggleGhost: () => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
  showGhost: true,
  toggleGhost: () => set(state => ({ showGhost: !state.showGhost })),
}));

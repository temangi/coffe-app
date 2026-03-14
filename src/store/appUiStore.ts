import { create } from 'zustand';

type LanguageCode = 'ru' | 'kg' | 'en';

interface AppUiState {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
}

export const useAppUiStore = create<AppUiState>((set) => ({
  language: 'ru',
  setLanguage: (language) => set({ language }),
}));

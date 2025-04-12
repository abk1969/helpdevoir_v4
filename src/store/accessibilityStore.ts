import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AccessibilitySettings {
  font: string;
  fontSize: number;
  lineSpacing: number;
  colorScheme: string;
  textToSpeech: boolean;
  voiceInput: boolean;
  isDyslexiaMode: boolean;
}

interface AccessibilityState extends AccessibilitySettings {
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  toggleDyslexiaMode: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      font: 'arial',
      fontSize: 16,
      lineSpacing: 1.5,
      colorScheme: 'cream',
      textToSpeech: false,
      voiceInput: false,
      isDyslexiaMode: false,
      updateSettings: (newSettings) =>
        set((state) => {
          // Appliquer les changements au document
          if (newSettings.font) {
            document.documentElement.style.setProperty(
              '--font-family',
              newSettings.font === 'opendyslexic' ? 'OpenDyslexic' : newSettings.font
            );
          }
          if (newSettings.fontSize) {
            document.documentElement.style.setProperty('--font-size', `${newSettings.fontSize}px`);
          }
          if (newSettings.lineSpacing) {
            document.documentElement.style.setProperty('--line-spacing', String(newSettings.lineSpacing));
          }
          if (newSettings.colorScheme) {
            const colors = {
              cream: '#f5f5dc',
              blue: '#e6f3ff',
              yellow: '#fafad2'
            };
            document.documentElement.style.setProperty(
              '--background-color',
              colors[newSettings.colorScheme as keyof typeof colors]
            );
          }
          return { ...state, ...newSettings };
        }),
      toggleDyslexiaMode: () =>
        set((state) => {
          const newIsDyslexiaMode = !state.isDyslexiaMode;
          if (newIsDyslexiaMode) {
            document.documentElement.classList.add('dyslexia-mode');
          } else {
            document.documentElement.classList.remove('dyslexia-mode');
          }
          return { ...state, isDyslexiaMode: newIsDyslexiaMode };
        })
    }),
    {
      name: 'accessibility-settings'
    }
  )
);
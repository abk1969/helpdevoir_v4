import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Ear, Eye, Volume2, Sun, Moon } from 'lucide-react';
import AccessibleLoginForm from './AccessibleLoginForm';
import { useThemeStore } from '../../store/themeStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';

const accessibilityModes = [
  {
    id: 'dyslexia',
    name: 'Mode Dyslexie',
    icon: Brain,
    description: 'Police adaptée et mise en page optimisée',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 'hearing',
    name: 'Mode Malentendant',
    icon: Ear,
    description: 'Support visuel et sous-titres',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    id: 'visual',
    name: 'Mode Malvoyant',
    icon: Eye,
    description: 'Contraste élevé et support audio',
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  }
];

export default function AccessibleAuthWrapper() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { updateSettings } = useAccessibilityStore();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleModeSelection = (modeId: string) => {
    setSelectedMode(modeId);
    switch (modeId) {
      case 'dyslexia':
        updateSettings({
          font: 'opendyslexic',
          fontSize: 18,
          lineSpacing: 2
        });
        break;
      case 'visual':
        updateSettings({
          fontSize: 20,
          contrast: 150,
          colorScheme: 'high-contrast'
        });
        break;
      case 'hearing':
        updateSettings({
          textToSpeech: true,
          voiceInput: true
        });
        break;
    }
  };

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contrôles d'accessibilité globaux */}
        <div className="fixed top-4 right-4 flex items-center space-x-4">
          <button
            onClick={() => readText('Page de connexion Help Devoir. Sélectionnez un mode d\'accessibilité si nécessaire.')}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            aria-label="Lecture audio de la page"
          >
            <Volume2 className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600"
            aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue sur Help Devoir
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Sélectionnez un mode d'accessibilité si nécessaire
          </p>
        </div>

        {/* Sélection du mode d'accessibilité */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {accessibilityModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;

            return (
              <motion.button
                key={mode.id}
                onClick={() => handleModeSelection(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-xl text-left transition-all ${mode.color} ${
                  isSelected ? 'ring-4 ring-indigo-600' : ''
                }`}
              >
                <div className="flex items-center mb-4">
                  <Icon className={`h-8 w-8 ${mode.iconColor}`} />
                  <h2 className="ml-3 text-xl font-semibold">{mode.name}</h2>
                </div>
                <p className="text-gray-600">{mode.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Formulaire de connexion */}
        <AccessibleLoginForm accessibilityMode={selectedMode} />
      </div>
    </div>
  );
}
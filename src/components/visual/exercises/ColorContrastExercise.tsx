import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Sun, Moon, Palette, Save, ArrowLeft } from 'lucide-react';
import TouchFeedback from '../../common/TouchFeedback';

interface ColorContrastExerciseProps {
  fontSize: number;
  contrast: number;
  onContrastChange: (value: number) => void;
  announceContent: (text: string) => void;
}

const colorThemes = [
  { id: 'default', name: 'Standard', bg: 'bg-white', text: 'text-gray-900' },
  { id: 'high-contrast', name: 'Contraste élevé', bg: 'bg-black', text: 'text-white' },
  { id: 'yellow-black', name: 'Jaune sur noir', bg: 'bg-black', text: 'text-yellow-400' },
  { id: 'blue-cream', name: 'Bleu sur crème', bg: 'bg-[#f5f5dc]', text: 'text-blue-900' },
  { id: 'dark-mode', name: 'Mode sombre', bg: 'bg-gray-900', text: 'text-gray-100' }
];

export default function ColorContrastExercise({
  fontSize,
  contrast,
  onContrastChange,
  announceContent
}: ColorContrastExerciseProps) {
  const [selectedTheme, setSelectedTheme] = useState(colorThemes[0]);
  const [brightness, setBrightness] = useState(100);
  const [savedPresets, setSavedPresets] = useState<Array<{
    name: string;
    theme: typeof colorThemes[0];
    contrast: number;
    brightness: number;
  }>>([]);

  const handleThemeChange = (theme: typeof colorThemes[0]) => {
    setSelectedTheme(theme);
    announceContent(`Thème ${theme.name} sélectionné`);
  };

  const savePreset = () => {
    const newPreset = {
      name: `Preset ${savedPresets.length + 1}`,
      theme: selectedTheme,
      contrast,
      brightness
    };
    setSavedPresets([...savedPresets, newPreset]);
    announceContent('Préréglage sauvegardé');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Personnalisation visuelle</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contrôles */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Thèmes de couleur</h3>
              <div className="grid grid-cols-2 gap-4">
                {colorThemes.map((theme) => (
                  <TouchFeedback
                    key={theme.id}
                    onClick={() => handleThemeChange(theme)}
                  >
                    <div
                      className={`p-4 rounded-lg ${theme.bg} ${theme.text} ${
                        selectedTheme.id === theme.id
                          ? 'ring-2 ring-indigo-500'
                          : ''
                      }`}
                    >
                      {theme.name}
                    </div>
                  </TouchFeedback>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Contraste</h3>
              <div className="flex items-center space-x-4">
                <Moon className="h-5 w-5" />
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={(e) => onContrastChange(Number(e.target.value))}
                  className="flex-1"
                />
                <Sun className="h-5 w-5" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Luminosité</h3>
              <div className="flex items-center space-x-4">
                <Moon className="h-5 w-5" />
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1"
                />
                <Sun className="h-5 w-5" />
              </div>
            </div>

            <TouchFeedback onClick={savePreset}>
              <div className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg">
                <Save className="h-5 w-5 mr-2" />
                Sauvegarder les réglages
              </div>
            </TouchFeedback>
          </div>

          {/* Aperçu */}
          <div>
            <h3 className="text-lg font-medium mb-4">Aperçu</h3>
            <div
              className={`p-6 rounded-lg ${selectedTheme.bg} ${selectedTheme.text}`}
              style={{
                filter: `contrast(${contrast}%) brightness(${brightness}%)`,
                fontSize: `${fontSize}px`
              }}
            >
              <h4 className="text-xl font-bold mb-4">Exemple de texte</h4>
              <p className="mb-4">
                Ce texte vous permet de tester les différents réglages de contraste
                et de luminosité. Ajustez les paramètres jusqu'à obtenir un
                confort de lecture optimal.
              </p>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  Bouton d'exemple
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg">
                  Autre bouton
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Préréglages sauvegardés */}
      {savedPresets.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Préréglages sauvegardés</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {savedPresets.map((preset, index) => (
              <TouchFeedback
                key={index}
                onClick={() => {
                  setSelectedTheme(preset.theme);
                  onContrastChange(preset.contrast);
                  setBrightness(preset.brightness);
                }}
              >
                <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Palette className="h-5 w-5 mb-2" />
                  <span className="font-medium">{preset.name}</span>
                </div>
              </TouchFeedback>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
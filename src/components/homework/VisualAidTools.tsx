import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Sun, Moon, Volume2 } from 'lucide-react';

interface VisualAidToolsProps {
  content: string;
  fontSize: number;
  contrast: number;
}

export default function VisualAidTools({ content, fontSize, contrast }: VisualAidToolsProps) {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localContrast, setLocalContrast] = useState(contrast);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const readText = () => {
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Outils d'aide visuelle</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setLocalFontSize(prev => Math.min(prev + 2, 24))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Augmenter la taille du texte"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={() => setLocalFontSize(prev => Math.max(prev - 2, 12))}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Diminuer la taille du texte"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Changer le mode jour/nuit"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={readText}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
            title="Lire le texte"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}
        style={{
          fontSize: `${localFontSize}px`,
          filter: `contrast(${localContrast}%)`
        }}
      >
        {content}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contraste
        </label>
        <input
          type="range"
          min="50"
          max="200"
          value={localContrast}
          onChange={(e) => setLocalContrast(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
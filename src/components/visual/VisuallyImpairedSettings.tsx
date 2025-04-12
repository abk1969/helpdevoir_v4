import React from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Eye, ZoomIn, Volume2, Contrast, Palette, Mic } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useLocalization } from '../../hooks/useLocalization';

const contrastOptions = [
  { id: 'normal', name: 'Normal', bg: 'bg-white', text: 'text-gray-900' },
  { id: 'high', name: 'Contraste élevé', bg: 'bg-black', text: 'text-white' },
  { id: 'inverted', name: 'Inversé', bg: 'bg-gray-900', text: 'text-white' }
];

/**
 * Composant pour les paramètres d'accessibilité des malvoyants
 */
export default function VisuallyImpairedSettings() {
  const {
    fontSize,
    highContrast,
    enableScreenReader,
    speechRate,
    zoomLevel,
    updateSettings
  } = useAccessibilityStore();
  
  const { t } = useLocalization();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('accessibility.visualSettings')}</h2>

      {/* Taille du texte */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <ZoomIn className="w-5 h-5 mr-2" />
          {t('accessibility.fontSize')}
        </label>
        <input
          type="range"
          min="16"
          max="32"
          value={fontSize}
          onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>A</span>
          <span>AAAA</span>
        </div>
      </div>

      {/* Niveau de zoom */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Eye className="w-5 h-5 mr-2" />
          {t('accessibility.zoomLevel')}
        </label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.1"
          value={zoomLevel}
          onChange={(e) => updateSettings({ zoomLevel: Number(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Contraste */}
      <div className="space-y-3">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Contrast className="w-5 h-5 mr-2" />
          {t('accessibility.contrast')}
        </label>
        <div className="flex gap-3">
          {contrastOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => updateSettings({ 
                highContrast: option.id === 'high' || option.id === 'inverted'
              })}
              className={`p-4 rounded-lg ${option.bg} ${option.text} transition-all ${
                (highContrast && (option.id === 'high' || option.id === 'inverted')) || 
                (!highContrast && option.id === 'normal')
                  ? 'ring-2 ring-indigo-600 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {t(`accessibility.contrastOptions.${option.id}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Lecteur d'écran */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Volume2 className="w-5 h-5 mr-2" />
          {t('accessibility.screenReader')}
        </label>
        <Switch.Root
          checked={enableScreenReader}
          onCheckedChange={(checked) => updateSettings({ enableScreenReader: checked })}
          className={`w-11 h-6 rounded-full transition-colors ${
            enableScreenReader ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Switch.Thumb 
            className={`block w-4 h-4 bg-white rounded-full transition-transform duration-100 transform ${
              enableScreenReader ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </Switch.Root>
      </div>

      {/* Vitesse de lecture */}
      {enableScreenReader && (
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Volume2 className="w-5 h-5 mr-2" />
            {t('accessibility.speechRate')}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => updateSettings({ speechRate: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{t('accessibility.slow')}</span>
            <span>{t('accessibility.normal')}</span>
            <span>{t('accessibility.fast')}</span>
          </div>
        </div>
      )}

      {/* Saisie vocale */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Mic className="w-5 h-5 mr-2" />
          {t('accessibility.voiceInput')}
        </label>
        <Switch.Root
          checked={useAccessibilityStore().voiceInput}
          onCheckedChange={(checked) => updateSettings({ voiceInput: checked })}
          className={`w-11 h-6 rounded-full transition-colors ${
            useAccessibilityStore().voiceInput ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Switch.Thumb 
            className={`block w-4 h-4 bg-white rounded-full transition-transform duration-100 transform ${
              useAccessibilityStore().voiceInput ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </Switch.Root>
      </div>
    </div>
  );
}

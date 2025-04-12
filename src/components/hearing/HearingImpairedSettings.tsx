import React from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { Ear, Video, Bell, MessageSquare, HandMetal } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useLocalization } from '../../hooks/useLocalization';

/**
 * Composant pour les paramètres d'accessibilité des malentendants
 */
export default function HearingImpairedSettings() {
  const {
    enableCaptions,
    enableVisualAlerts,
    updateSettings
  } = useAccessibilityStore();
  
  const { t } = useLocalization();

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('accessibility.hearingSettings')}</h2>

      {/* Sous-titres */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Video className="w-5 h-5 mr-2" />
          {t('accessibility.captions')}
        </label>
        <Switch.Root
          checked={enableCaptions}
          onCheckedChange={(checked) => updateSettings({ enableCaptions: checked })}
          className={`w-11 h-6 rounded-full transition-colors ${
            enableCaptions ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Switch.Thumb 
            className={`block w-4 h-4 bg-white rounded-full transition-transform duration-100 transform ${
              enableCaptions ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </Switch.Root>
      </div>

      {/* Alertes visuelles */}
      <div className="flex items-center justify-between">
        <label className="flex items-center text-sm font-medium text-gray-700">
          <Bell className="w-5 h-5 mr-2" />
          {t('accessibility.visualAlerts')}
        </label>
        <Switch.Root
          checked={enableVisualAlerts}
          onCheckedChange={(checked) => updateSettings({ enableVisualAlerts: checked })}
          className={`w-11 h-6 rounded-full transition-colors ${
            enableVisualAlerts ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <Switch.Thumb 
            className={`block w-4 h-4 bg-white rounded-full transition-transform duration-100 transform ${
              enableVisualAlerts ? 'translate-x-6' : 'translate-x-1'
            }`} 
          />
        </Switch.Root>
      </div>

      {/* Langue des signes */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <HandMetal className="w-5 h-5 mr-2" />
          {t('accessibility.signLanguage')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              // Action pour activer la langue des signes française (LSF)
              // Cette fonctionnalité nécessiterait une implémentation plus complexe
            }}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-2">🇫🇷</span>
            {t('accessibility.frenchSignLanguage')}
          </button>
          <button
            onClick={() => {
              // Action pour activer la langue des signes américaine (ASL)
              // Cette fonctionnalité nécessiterait une implémentation plus complexe
            }}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <span className="mr-2">🇺🇸</span>
            {t('accessibility.americanSignLanguage')}
          </button>
        </div>
      </div>

      {/* Transcription en temps réel */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          {t('accessibility.realTimeTranscription')}
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-4">
            {t('accessibility.transcriptionDescription')}
          </p>
          <button
            onClick={() => {
              // Action pour activer la transcription en temps réel
              // Cette fonctionnalité nécessiterait une implémentation plus complexe
            }}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('accessibility.enableTranscription')}
          </button>
        </div>
      </div>
    </div>
  );
}

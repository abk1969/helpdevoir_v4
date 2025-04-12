import React from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { useLocalization } from '../../hooks/useLocalization';
import { Brain, BookOpen, Sparkles, Settings } from 'lucide-react';
import DyslexiaSettings from './DyslexiaSettings';

export default function DyslexiaSupport() {
  const { isDyslexiaMode, toggleDyslexiaMode } = useAccessibilityStore();
  const { t } = useLocalization();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
            {t('accessibility.dyslexiaMode')}
          </h2>
          <p className={`text-gray-600 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
            {t('accessibility.dyslexiaModeDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className={`ml-3 text-lg font-semibold ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                {t('accessibility.adaptedReading')}
              </h3>
            </div>
            <ul className={`space-y-2 text-gray-600 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
              <li>• {t('accessibility.openDyslexicFont')}</li>
              <li>• {t('accessibility.adjustableLetterSpacing')}</li>
              <li>• {t('accessibility.customContrast')}</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className={`ml-3 text-lg font-semibold ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                {t('accessibility.helpTools')}
              </h3>
            </div>
            <ul className={`space-y-2 text-gray-600 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
              <li>• {t('accessibility.integratedTextToSpeech')}</li>
              <li>• {t('accessibility.voiceDictation')}</li>
              <li>• {t('accessibility.visualReadingGuides')}</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className={`ml-3 text-lg font-semibold ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                {t('accessibility.features')}
              </h3>
            </div>
            <ul className={`space-y-2 text-gray-600 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
              <li>• {t('accessibility.simplifiedInterface')}</li>
              <li>• {t('accessibility.audioInstructions')}</li>
              <li>• {t('accessibility.adaptedExercises')}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={toggleDyslexiaMode}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isDyslexiaMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
            }`}
          >
            {isDyslexiaMode ? t('accessibility.disable') + ' ' + t('accessibility.dyslexiaMode').toLowerCase() : t('accessibility.enable') + ' ' + t('accessibility.dyslexiaMode').toLowerCase()}
          </button>

          {isDyslexiaMode && (
            <div className="w-full mt-8">
              <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className={`text-lg font-semibold ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                  {t('accessibility.customization')}
                </h3>
              </div>
              <DyslexiaSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
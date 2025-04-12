import React, { useState } from 'react';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { useLocalization } from '../../hooks/useLocalization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Eye, Ear, Brain, Settings } from 'lucide-react';
import DyslexiaSettings from './DyslexiaSettings';
import VisuallyImpairedSettings from '../visual/VisuallyImpairedSettings';
import HearingImpairedSettings from '../hearing/HearingImpairedSettings';

/**
 * Composant central pour gérer tous les paramètres d'accessibilité
 */
export default function AccessibilitySettings() {
  const { 
    isDyslexiaMode, 
    isHearingImpaired, 
    isVisuallyImpaired,
    toggleDyslexiaMode,
    toggleHearingImpaired,
    toggleVisuallyImpaired
  } = useAccessibilityStore();
  
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-gray-900">{t('accessibility.settings')}</h2>
        <p className="text-gray-600 mt-2">{t('accessibility.settingsDescription')}</p>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('accessibility.accessibilityModes')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Mode Dyslexie */}
          <div className={`border rounded-lg p-4 ${isDyslexiaMode ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full ${isDyslexiaMode ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <Brain className={`h-5 w-5 ${isDyslexiaMode ? 'text-purple-600' : 'text-gray-500'}`} />
              </div>
              <h4 className="ml-2 font-medium">{t('accessibility.dyslexiaMode')}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('accessibility.dyslexiaModeDescription')}</p>
            <button
              onClick={toggleDyslexiaMode}
              className={`w-full py-2 rounded-lg transition-colors ${
                isDyslexiaMode 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isDyslexiaMode ? t('accessibility.disable') : t('accessibility.enable')}
            </button>
          </div>

          {/* Mode Malvoyant */}
          <div className={`border rounded-lg p-4 ${isVisuallyImpaired ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full ${isVisuallyImpaired ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Eye className={`h-5 w-5 ${isVisuallyImpaired ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <h4 className="ml-2 font-medium">{t('accessibility.visuallyImpairedMode')}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('accessibility.visuallyImpairedModeDescription')}</p>
            <button
              onClick={toggleVisuallyImpaired}
              className={`w-full py-2 rounded-lg transition-colors ${
                isVisuallyImpaired 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isVisuallyImpaired ? t('accessibility.disable') : t('accessibility.enable')}
            </button>
          </div>

          {/* Mode Malentendant */}
          <div className={`border rounded-lg p-4 ${isHearingImpaired ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className={`p-2 rounded-full ${isHearingImpaired ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Ear className={`h-5 w-5 ${isHearingImpaired ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <h4 className="ml-2 font-medium">{t('accessibility.hearingImpairedMode')}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">{t('accessibility.hearingImpairedModeDescription')}</p>
            <button
              onClick={toggleHearingImpaired}
              className={`w-full py-2 rounded-lg transition-colors ${
                isHearingImpaired 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isHearingImpaired ? t('accessibility.disable') : t('accessibility.enable')}
            </button>
          </div>
        </div>

        {/* Onglets de paramètres spécifiques */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            {t('accessibility.advancedSettings')}
          </h3>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex border-b mb-6">
              <TabsTrigger 
                value="general" 
                className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
              >
                {t('accessibility.general')}
              </TabsTrigger>
              {isDyslexiaMode && (
                <TabsTrigger 
                  value="dyslexia" 
                  className={`px-4 py-2 ${activeTab === 'dyslexia' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}
                >
                  {t('accessibility.dyslexia')}
                </TabsTrigger>
              )}
              {isVisuallyImpaired && (
                <TabsTrigger 
                  value="visual" 
                  className={`px-4 py-2 ${activeTab === 'visual' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                >
                  {t('accessibility.visual')}
                </TabsTrigger>
              )}
              {isHearingImpaired && (
                <TabsTrigger 
                  value="hearing" 
                  className={`px-4 py-2 ${activeTab === 'hearing' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-500'}`}
                >
                  {t('accessibility.hearing')}
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="general">
              <p className="text-gray-600 mb-4">{t('accessibility.generalSettingsDescription')}</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">{t('accessibility.selectModeFirst')}</p>
              </div>
            </TabsContent>

            <TabsContent value="dyslexia">
              <DyslexiaSettings />
            </TabsContent>

            <TabsContent value="visual">
              <VisuallyImpairedSettings />
            </TabsContent>

            <TabsContent value="hearing">
              <HearingImpairedSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

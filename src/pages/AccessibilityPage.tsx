import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useAccessibilityStore } from '../store/accessibilityStore';
import AccessibilitySettings from '../components/accessibility/AccessibilitySettings';
import { Brain, Eye, Ear, Info } from 'lucide-react';

/**
 * Page dédiée aux paramètres d'accessibilité
 */
export default function AccessibilityPage() {
  const { t } = useLocalization();
  const { isDyslexiaMode, isVisuallyImpaired, isHearingImpaired } = useAccessibilityStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
          {t('accessibility.title')}
        </h1>
        <p className={`text-gray-600 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
          {t('accessibility.description')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <AccessibilitySettings />
        </div>

        <div className="space-y-6">
          {/* Informations sur l'accessibilité */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className={`text-xl font-semibold ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                {t('accessibility.aboutAccessibility')}
              </h2>
            </div>
            <p className={`text-gray-600 mb-4 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
              {t('accessibility.aboutAccessibilityDescription')}
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mt-1">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <h3 className={`text-md font-medium ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.dyslexiaSupport')}
                  </h3>
                  <p className={`text-sm text-gray-500 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.dyslexiaSupportDescription')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className={`text-md font-medium ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.visualSupport')}
                  </h3>
                  <p className={`text-sm text-gray-500 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.visualSupportDescription')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mt-1">
                  <Ear className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className={`text-md font-medium ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.hearingSupport')}
                  </h3>
                  <p className={`text-sm text-gray-500 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
                    {t('accessibility.hearingSupportDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ressources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className={`text-xl font-semibold mb-4 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}>
              {t('accessibility.resources')}
            </h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.w3.org/WAI/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-indigo-600 hover:underline ${isDyslexiaMode ? 'font-dyslexic' : ''}`}
                >
                  W3C Web Accessibility Initiative (WAI)
                </a>
              </li>
              <li>
                <a 
                  href="https://www.dyslexia-international.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-indigo-600 hover:underline ${isDyslexiaMode ? 'font-dyslexic' : ''}`}
                >
                  Dyslexia International
                </a>
              </li>
              <li>
                <a 
                  href="https://webaim.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-indigo-600 hover:underline ${isDyslexiaMode ? 'font-dyslexic' : ''}`}
                >
                  WebAIM - Web Accessibility In Mind
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

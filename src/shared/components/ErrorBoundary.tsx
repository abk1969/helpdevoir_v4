import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import TouchFeedback from './TouchFeedback';
import { appLogger } from '../../core/utils/logger';
import { errorHandler } from '../../core/utils/errorHandler';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { useLocalizationStore } from '../../store/localizationStore';
import i18n from 'i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  errorTitle?: string;
  errorMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Mettre à jour l'état avec les informations d'erreur
    this.setState({ errorInfo });

    // Journaliser l'erreur
    appLogger.error('Erreur non gérée dans le composant', {
      error: error.message,
      component: errorInfo.componentStack,
      stack: error.stack
    });

    // Utiliser le gestionnaire d'erreurs global
    errorHandler.handleError(error, 'Rendu de composant');

    // Appeler le callback onError si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    appLogger.info('Tentative de récupération après erreur', {
      error: this.state.error?.message
    });

    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    window.location.reload();
  };

  private handleBack = () => {
    appLogger.info('Retour après erreur');

    if (this.props.onBack) {
      this.props.onBack();
    } else {
      window.history.back();
    }
  };

  private handleHome = () => {
    appLogger.info('Retour à l\'accueil après erreur');
    window.location.href = '/';
  };

  public render() {
    // Utiliser les valeurs par défaut pour les props
    const {
      fallback,
      showHomeButton = true,
      showBackButton = true,
      errorTitle = 'Une erreur est survenue',
      errorMessage = 'Nous nous excusons pour la gêne occasionnée.'
    } = this.props;

    // Accéder aux stores
    const accessibilityStore = useAccessibilityStore.getState();
    const localizationStore = useLocalizationStore.getState();
    const { isDyslexiaMode, isVisuallyImpaired } = accessibilityStore;
    const { language } = localizationStore;

    // Traduire les textes
    const translate = (key: string, defaultValue: string): string => {
      return i18n.exists(key) ? i18n.t(key) : defaultValue;
    };

    // Adapter le style en fonction des paramètres d'accessibilité
    const textSize = isVisuallyImpaired ? 'text-3xl' : 'text-2xl';
    const paragraphSize = isVisuallyImpaired ? 'text-xl' : 'text-base';
    const buttonSize = isVisuallyImpaired ? 'px-8 py-4' : 'px-6 py-3';
    const iconSize = isVisuallyImpaired ? 'h-6 w-6' : 'h-5 w-5';
    const fontClass = isDyslexiaMode ? 'font-dyslexic' : '';
    const contrastClass = isVisuallyImpaired && accessibilityStore.highContrast
      ? 'bg-black text-white'
      : 'bg-gray-50 text-gray-900';

    if (this.state.hasError) {
      return fallback || (
        <div className={`min-h-screen flex items-center justify-center ${contrastClass} px-4`}>
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className={`${textSize} font-bold mb-4 ${fontClass}`}>
              {translate('errors.errorTitle', errorTitle)}
            </h1>

            <p className={`${paragraphSize} text-gray-600 mb-8 ${fontClass}`}>
              {translate('errors.errorMessage', errorMessage)}
              {this.state.error && (
                <span className="block mt-2 text-sm text-red-500">
                  {this.state.error.message}
                </span>
              )}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <TouchFeedback onClick={this.handleReset}>
                <div className={`inline-flex items-center ${buttonSize} bg-indigo-600 text-white rounded-lg ${fontClass}`}>
                  <RefreshCw className={`${iconSize} mr-2`} />
                  {translate('errors.reload', 'Recharger la page')}
                </div>
              </TouchFeedback>

              {showBackButton && (
                <TouchFeedback onClick={this.handleBack}>
                  <div className={`inline-flex items-center ${buttonSize} bg-gray-200 text-gray-800 rounded-lg ${fontClass}`}>
                    <ArrowLeft className={`${iconSize} mr-2`} />
                    {translate('errors.back', 'Retour')}
                  </div>
                </TouchFeedback>
              )}

              {showHomeButton && (
                <TouchFeedback onClick={this.handleHome}>
                  <div className={`inline-flex items-center ${buttonSize} bg-gray-200 text-gray-800 rounded-lg ${fontClass}`}>
                    <Home className={`${iconSize} mr-2`} />
                    {translate('errors.home', 'Accueil')}
                  </div>
                </TouchFeedback>
              )}
            </div>

            {isVisuallyImpaired && (
              <div className="mt-8">
                <button
                  onClick={() => {
                    if (this.state.error) {
                      const utterance = new SpeechSynthesisUtterance(
                        `${translate('errors.errorTitle', errorTitle)}. ${translate('errors.errorMessage', errorMessage)}. ${translate('errors.error', 'Erreur')}: ${this.state.error.message}`
                      );
                      utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {translate('errors.readErrorMessage', 'Lire le message d\'erreur')}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

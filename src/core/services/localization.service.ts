import { ApiService } from './api.service';
import { apiLogger } from '../utils/logger';
import { Language, useLocalizationStore } from '../../store/localizationStore';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importer les fichiers de traduction
import translationFR from '../../locales/fr/translation.json';
import translationEN from '../../locales/en/translation.json';
import accessibilityFR from '../../locales/fr/accessibility.json';
import accessibilityEN from '../../locales/en/accessibility.json';

// Ressources de traduction
const resources = {
  fr: {
    translation: translationFR,
    accessibility: accessibilityFR.accessibility
  },
  en: {
    translation: translationEN,
    accessibility: accessibilityEN.accessibility
  }
};

/**
 * Service pour gérer la localisation
 */
class LocalizationService extends ApiService {
  private initialized: boolean = false;

  constructor() {
    super();
    apiLogger.info('Service de localisation initialisé');
  }

  /**
   * Initialise le service de localisation
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialiser i18next
      await i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          resources,
          fallbackLng: 'fr',
          interpolation: {
            escapeValue: false // React gère déjà l'échappement
          },
          detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'i18nextLng',
            caches: ['localStorage']
          }
        });

      // Récupérer la langue actuelle du store
      const localizationStore = useLocalizationStore.getState();
      const currentLanguage = localizationStore.language;

      // Définir la langue
      await this.changeLanguage(currentLanguage);

      this.initialized = true;
      apiLogger.info('Service de localisation initialisé avec succès', { language: currentLanguage });
    } catch (error) {
      apiLogger.error('Erreur lors de l\'initialisation du service de localisation', { error });
      throw error;
    }
  }

  /**
   * Change la langue
   * @param language Langue à définir
   */
  async changeLanguage(language: Language): Promise<void> {
    try {
      // Mettre à jour la langue dans i18next
      await i18n.changeLanguage(language);

      // Mettre à jour la langue dans le store
      const localizationStore = useLocalizationStore.getState();
      localizationStore.setLanguage(language);

      // Mettre à jour l'attribut lang de la balise html
      document.documentElement.setAttribute('lang', language);

      apiLogger.info('Langue changée', { language });
    } catch (error) {
      apiLogger.error('Erreur lors du changement de langue', { error });
      throw error;
    }
  }

  /**
   * Détecte la langue du navigateur
   * @returns Langue détectée
   */
  detectLanguage(): Language {
    try {
      const localizationStore = useLocalizationStore.getState();
      const detectedLanguage = localizationStore.detectLanguage();

      apiLogger.info('Langue détectée', { language: detectedLanguage });

      return detectedLanguage;
    } catch (error) {
      apiLogger.error('Erreur lors de la détection de la langue', { error });
      return 'fr';
    }
  }

  /**
   * Récupère la langue actuelle
   * @returns Langue actuelle
   */
  getCurrentLanguage(): Language {
    return useLocalizationStore.getState().language;
  }

  /**
   * Vérifie si la langue est prise en charge
   * @param language Langue à vérifier
   * @returns true si la langue est prise en charge, false sinon
   */
  isLanguageSupported(language: string): boolean {
    return language === 'fr' || language === 'en';
  }

  /**
   * Récupère les langues disponibles
   * @returns Langues disponibles
   */
  getAvailableLanguages(): { code: Language; name: string }[] {
    return [
      { code: 'fr', name: 'Français' },
      { code: 'en', name: 'English' }
    ];
  }

  /**
   * Traduit une clé
   * @param key Clé à traduire
   * @param options Options de traduction
   * @returns Traduction
   */
  translate(key: string, options?: Record<string, any>): string {
    return i18n.t(key, options);
  }

  /**
   * Récupère la configuration de localisation depuis le serveur
   */
  async fetchLocalizationConfig(): Promise<{ language: Language }> {
    apiLogger.debug('Récupération de la configuration de localisation');

    try {
      const config = await this.get<{ language: Language }>('/api/localization/config');
      apiLogger.info('Configuration de localisation récupérée', config);

      // Appliquer la configuration
      await this.changeLanguage(config.language);

      return config;
    } catch (error) {
      apiLogger.error('Erreur lors de la récupération de la configuration de localisation', { error });
      throw error;
    }
  }
}

export default new LocalizationService();

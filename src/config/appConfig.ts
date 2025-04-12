/**
 * Configuration centralisée de l'application
 * Contient les paramètres globaux et les constantes
 */

// Environnement
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Paramètres d'authentification
const AUTH_CONFIG = {
  tokenKey: 'auth-token',
  refreshTokenKey: 'refresh-token',
  tokenExpiry: 60 * 60 * 1000, // 1 heure en millisecondes
  sessionTimeout: 30 * 60 * 1000, // 30 minutes en millisecondes
};

// Paramètres de l'API
const API_CONFIG = {
  baseUrl: apiUrl,
  timeout: 30000, // 30 secondes
  retryAttempts: 3,
  retryDelay: 1000, // 1 seconde
};

// Paramètres de sauvegarde
const BACKUP_CONFIG = {
  autoSaveInterval: 5 * 60 * 1000, // 5 minutes
  maxBackups: 50,
  storageKey: 'backups',
};

// Paramètres d'accessibilité
const ACCESSIBILITY_CONFIG = {
  defaultFontSize: 16,
  defaultLineSpacing: 1.5,
  defaultColorScheme: 'default',
  dyslexiaFontFamily: 'OpenDyslexic, Arial, sans-serif',
  highContrastColors: {
    background: '#000000',
    text: '#FFFFFF',
    links: '#FFFF00',
  },
};

// Paramètres de quota AI
const AI_QUOTA_CONFIG = {
  freemium: {
    maxPrompts: 10,
    maxTokens: 5000,
    resetPeriod: 24 * 60 * 60 * 1000, // 24 heures
  },
  premium: {
    maxPrompts: 100,
    maxTokens: 50000,
    resetPeriod: 24 * 60 * 60 * 1000, // 24 heures
  },
};

// Paramètres de l'application
const APP_CONFIG = {
  appName: 'HelpDevoir',
  appVersion: '1.0.0',
  supportEmail: 'support@helpdevoir.fr',
  maxUploadSize: 10 * 1024 * 1024, // 10 Mo
  acceptedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

// Configuration exportée
export default {
  isDev,
  isProd,
  apiUrl,
  auth: AUTH_CONFIG,
  api: API_CONFIG,
  backup: BACKUP_CONFIG,
  accessibility: ACCESSIBILITY_CONFIG,
  aiQuota: AI_QUOTA_CONFIG,
  app: APP_CONFIG,
};

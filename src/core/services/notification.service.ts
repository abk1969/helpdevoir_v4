import { ApiService } from './api.service';
import { Notification, useNotificationStore } from '../../store/notificationStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import { useLocalizationStore } from '../../store/localizationStore';
import { apiLogger } from '../utils/logger';
import toast, { Toast, ToastOptions } from 'react-hot-toast';
import i18n from 'i18next';

/**
 * Options pour les notifications
 */
export interface NotificationOptions {
  // Options pour les notifications persistantes
  persistent?: boolean;

  // Options pour les toasts
  duration?: number;
  id?: string;
  icon?: React.ReactNode;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  // Options d'accessibilité
  screenReaderAnnounce?: boolean;

  // Callbacks
  onDismiss?: () => void;
  onClick?: () => void;
}

/**
 * Service pour gérer les notifications
 */
class NotificationService extends ApiService {
  constructor() {
    super();
    apiLogger.info('Service de notification initialisé');
  }

  /**
   * Affiche une notification de succès
   * @param message Message de la notification
   * @param options Options de la notification
   * @returns ID de la notification ou instance du toast
   */
  success(message: string, title?: string, options: NotificationOptions = {}): string | Toast {
    apiLogger.info('Notification de succès', { message, title, options });

    if (options.persistent) {
      return this.addPersistentNotification({
        title: title || this.getTranslation('common.success', 'Succès'),
        message,
        type: 'success'
      });
    } else {
      return this.showToast(message, { ...options, type: 'success' });
    }
  }

  /**
   * Affiche une notification d'information
   * @param message Message de la notification
   * @param options Options de la notification
   * @returns ID de la notification ou instance du toast
   */
  info(message: string, title?: string, options: NotificationOptions = {}): string | Toast {
    apiLogger.info('Notification d\'information', { message, title, options });

    if (options.persistent) {
      return this.addPersistentNotification({
        title: title || this.getTranslation('common.info', 'Information'),
        message,
        type: 'info'
      });
    } else {
      return this.showToast(message, { ...options, type: 'info' });
    }
  }

  /**
   * Affiche une notification d'avertissement
   * @param message Message de la notification
   * @param options Options de la notification
   * @returns ID de la notification ou instance du toast
   */
  warning(message: string, title?: string, options: NotificationOptions = {}): string | Toast {
    apiLogger.warn('Notification d\'avertissement', { message, title, options });

    if (options.persistent) {
      return this.addPersistentNotification({
        title: title || this.getTranslation('common.warning', 'Avertissement'),
        message,
        type: 'warning'
      });
    } else {
      return this.showToast(message, { ...options, type: 'warning' });
    }
  }

  /**
   * Affiche une notification d'erreur
   * @param message Message de la notification
   * @param options Options de la notification
   * @returns ID de la notification ou instance du toast
   */
  error(message: string, title?: string, options: NotificationOptions = {}): string | Toast {
    apiLogger.error('Notification d\'erreur', { message, title, options });

    if (options.persistent) {
      return this.addPersistentNotification({
        title: title || this.getTranslation('common.error', 'Erreur'),
        message,
        type: 'error'
      });
    } else {
      return this.showToast(message, { ...options, type: 'error' });
    }
  }

  /**
   * Supprime une notification
   * @param id ID de la notification
   */
  dismiss(id: string): void {
    apiLogger.debug(`Suppression de la notification ${id}`);

    // Essayer de supprimer un toast
    toast.dismiss(id);

    // Essayer de supprimer une notification persistante
    try {
      const notificationStore = useNotificationStore.getState();
      notificationStore.deleteNotification(id);
    } catch (error) {
      apiLogger.error(`Erreur lors de la suppression de la notification ${id}`, { error });
    }
  }

  /**
   * Marque une notification comme lue
   * @param id ID de la notification
   */
  markAsRead(id: string): void {
    apiLogger.debug(`Marquage de la notification ${id} comme lue`);

    try {
      const notificationStore = useNotificationStore.getState();
      notificationStore.markAsRead(id);
    } catch (error) {
      apiLogger.error(`Erreur lors du marquage de la notification ${id} comme lue`, { error });
    }
  }

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead(): void {
    apiLogger.debug('Marquage de toutes les notifications comme lues');

    try {
      const notificationStore = useNotificationStore.getState();
      notificationStore.markAllAsRead();
    } catch (error) {
      apiLogger.error('Erreur lors du marquage de toutes les notifications comme lues', { error });
    }
  }

  /**
   * Supprime toutes les notifications
   */
  clearAll(): void {
    apiLogger.debug('Suppression de toutes les notifications');

    // Supprimer tous les toasts
    toast.dismiss();

    // Supprimer toutes les notifications persistantes
    try {
      const notificationStore = useNotificationStore.getState();
      notificationStore.clearAll();
    } catch (error) {
      apiLogger.error('Erreur lors de la suppression de toutes les notifications', { error });
    }
  }

  /**
   * Récupère toutes les notifications persistantes
   * @returns Liste des notifications
   */
  getNotifications(): Notification[] {
    try {
      const notificationStore = useNotificationStore.getState();
      return notificationStore.notifications;
    } catch (error) {
      apiLogger.error('Erreur lors de la récupération des notifications', { error });
      return [];
    }
  }

  /**
   * Récupère le nombre de notifications non lues
   * @returns Nombre de notifications non lues
   */
  getUnreadCount(): number {
    try {
      const notificationStore = useNotificationStore.getState();
      return notificationStore.unreadCount;
    } catch (error) {
      apiLogger.error('Erreur lors de la récupération du nombre de notifications non lues', { error });
      return 0;
    }
  }

  /**
   * Ajoute une notification persistante
   * @param notification Notification à ajouter
   * @returns ID de la notification
   */
  private addPersistentNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>): string {
    try {
      const notificationStore = useNotificationStore.getState();

      // Générer un ID pour pouvoir le retourner
      const id = crypto.randomUUID();

      notificationStore.addNotification({
        ...notification,
        id
      });

      return id;
    } catch (error) {
      apiLogger.error('Erreur lors de l\'ajout de la notification persistante', { error });
      return '';
    }
  }

  /**
   * Affiche un toast
   * @param message Message du toast
   * @param options Options du toast
   * @returns Instance du toast
   */
  private showToast(message: string, options: NotificationOptions & { type: 'success' | 'error' | 'info' | 'warning' }): Toast {
    // Récupérer les paramètres d'accessibilité
    const accessibilityStore = useAccessibilityStore.getState();
    const { isDyslexiaMode, isVisuallyImpaired } = accessibilityStore;

    // Adapter le message en fonction des paramètres d'accessibilité
    let adaptedMessage = message;

    if (isDyslexiaMode) {
      // Simplifier le message pour les personnes dyslexiques
      adaptedMessage = adaptedMessage
        .replace(/\b(\w{10,})\b/g, (match) => {
          // Diviser les mots longs en syllabes approximatives
          const syllables = match.match(/.{1,4}/g) || [];
          return syllables.join('-');
        });
    }

    if (isVisuallyImpaired) {
      // Simplifier et clarifier le message pour les personnes malvoyantes
      adaptedMessage = adaptedMessage
        .replace(/\b(erreur|problème)\b/gi, 'ERREUR')
        .replace(/\b(important|critique)\b/gi, 'IMPORTANT');
    }

    // Configurer les options du toast
    const toastOptions: ToastOptions = {
      duration: options.duration || 3000,
      id: options.id,
      icon: options.icon,
      position: options.position,
      style: {
        background: '#333',
        color: '#fff',
        fontSize: isVisuallyImpaired ? '1.2rem' : '1rem',
        fontFamily: isDyslexiaMode ? 'OpenDyslexic, sans-serif' : 'inherit',
      },
    };

    // Ajouter les callbacks
    if (options.onClick) {
      toastOptions.onClick = options.onClick;
    }

    if (options.onDismiss) {
      toastOptions.onDismiss = options.onDismiss;
    }

    // Annoncer le message pour les lecteurs d'écran
    if (options.screenReaderAnnounce && isVisuallyImpaired && accessibilityStore.enableScreenReader) {
      this.announceForScreenReader(adaptedMessage, options.type);
    }

    // Afficher le toast en fonction du type
    switch (options.type) {
      case 'success':
        return toast.success(adaptedMessage, toastOptions);
      case 'error':
        return toast.error(adaptedMessage, toastOptions);
      case 'info':
        return toast(adaptedMessage, toastOptions);
      case 'warning':
        return toast(adaptedMessage, {
          ...toastOptions,
          icon: '⚠️',
          style: {
            ...toastOptions.style,
            background: '#fbbf24',
            color: '#000',
          },
        });
    }
  }

  /**
   * Annonce un message pour les lecteurs d'écran
   * @param message Message à annoncer
   * @param type Type de notification
   */
  private announceForScreenReader(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    // Récupérer la langue actuelle
    const localizationStore = useLocalizationStore.getState();
    const { language } = localizationStore;

    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${this.getTypeTranslation(type)}: ${message}`;
    utterance.lang = language === 'fr' ? 'fr-FR' : 'en-US';

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Récupère une traduction
   * @param key Clé de traduction
   * @param defaultValue Valeur par défaut
   * @returns Traduction
   */
  private getTranslation(key: string, defaultValue: string): string {
    return i18n.exists(key) ? i18n.t(key) : defaultValue;
  }

  /**
   * Récupère la traduction du type de notification
   * @param type Type de notification
   * @returns Traduction du type
   */
  private getTypeTranslation(type: 'success' | 'error' | 'info' | 'warning'): string {
    switch (type) {
      case 'success':
        return this.getTranslation('common.success', 'Succès');
      case 'error':
        return this.getTranslation('common.error', 'Erreur');
      case 'warning':
        return this.getTranslation('common.warning', 'Avertissement');
      case 'info':
        return this.getTranslation('common.info', 'Information');
    }
  }
}

export default new NotificationService();

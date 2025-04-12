import { useCallback } from 'react';
import notificationService, { NotificationOptions } from '../core/services/notification.service';
import { Notification } from '../store/notificationStore';
import { useNotificationStore } from '../store/notificationStore';
import { useLocalization } from './useLocalization';

/**
 * Hook pour utiliser le service de notification dans les composants React
 * @returns Fonctions pour gérer les notifications
 */
export function useNotification() {
  const { notifications, unreadCount } = useNotificationStore();
  const { t } = useLocalization();

  /**
   * Affiche une notification de succès
   * @param message Message de la notification
   * @param title Titre de la notification (optionnel)
   * @param options Options de la notification
   */
  const success = useCallback((message: string, title?: string, options?: NotificationOptions) => {
    return notificationService.success(message, title || t('common.success'), options);
  }, [t]);

  /**
   * Affiche une notification d'information
   * @param message Message de la notification
   * @param title Titre de la notification (optionnel)
   * @param options Options de la notification
   */
  const info = useCallback((message: string, title?: string, options?: NotificationOptions) => {
    return notificationService.info(message, title || t('common.info'), options);
  }, [t]);

  /**
   * Affiche une notification d'avertissement
   * @param message Message de la notification
   * @param title Titre de la notification (optionnel)
   * @param options Options de la notification
   */
  const warning = useCallback((message: string, title?: string, options?: NotificationOptions) => {
    return notificationService.warning(message, title || t('common.warning'), options);
  }, [t]);

  /**
   * Affiche une notification d'erreur
   * @param message Message de la notification
   * @param title Titre de la notification (optionnel)
   * @param options Options de la notification
   */
  const error = useCallback((message: string, title?: string, options?: NotificationOptions) => {
    return notificationService.error(message, title || t('common.error'), options);
  }, [t]);

  /**
   * Supprime une notification
   * @param id ID de la notification
   */
  const dismiss = useCallback((id: string) => {
    notificationService.dismiss(id);
  }, []);

  /**
   * Marque une notification comme lue
   * @param id ID de la notification
   */
  const markAsRead = useCallback((id: string) => {
    notificationService.markAsRead(id);
  }, []);

  /**
   * Marque toutes les notifications comme lues
   */
  const markAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
  }, []);

  /**
   * Supprime toutes les notifications
   */
  const clearAll = useCallback(() => {
    notificationService.clearAll();
  }, []);

  return {
    // Méthodes pour afficher des notifications
    success,
    info,
    warning,
    error,

    // Méthodes pour gérer les notifications
    dismiss,
    markAsRead,
    markAllAsRead,
    clearAll,

    // État des notifications
    notifications,
    unreadCount,
  };
}

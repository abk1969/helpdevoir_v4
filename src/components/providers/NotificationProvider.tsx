import React, { useEffect, useState } from 'react';
import notificationService from '../../core/services/notification.service';
import { useNotificationStore } from '../../store/notificationStore';
import { apiLogger } from '../../core/utils/logger';
import { useLocalization } from '../../hooks/useLocalization';

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
}

/**
 * Fournisseur de notification
 * @param props Props du composant
 * @returns Composant NotificationProvider
 */
export default function NotificationProvider({
  children,
  maxNotifications = 50
}: NotificationProviderProps) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const { t } = useLocalization();
  
  // Initialiser le service de notification
  useEffect(() => {
    if (!isInitialized) {
      try {
        // Le service de notification est déjà initialisé dans son constructeur,
        // mais nous pouvons effectuer des opérations supplémentaires ici si nécessaire
        
        // Limiter le nombre de notifications stockées
        const notificationStore = useNotificationStore.getState();
        const notifications = notificationStore.notifications;
        
        if (notifications.length > maxNotifications) {
          // Supprimer les notifications les plus anciennes
          const notificationsToKeep = notifications.slice(0, maxNotifications);
          const unreadCount = notificationsToKeep.filter(n => !n.read).length;
          
          // Mettre à jour le store
          notificationStore.clearAll();
          notificationsToKeep.forEach(notification => {
            notificationStore.addNotification({
              title: notification.title,
              message: notification.message,
              type: notification.type
            });
            
            // Marquer comme lu si nécessaire
            if (notification.read) {
              notificationStore.markAsRead(notification.id);
            }
          });
        }
        
        setIsInitialized(true);
        apiLogger.info('Fournisseur de notification initialisé avec succès');
      } catch (error) {
        apiLogger.error('Erreur lors de l\'initialisation du fournisseur de notification', { error });
      }
    }
  }, [isInitialized, maxNotifications]);
  
  // Écouter les changements de langue pour mettre à jour les titres par défaut
  useEffect(() => {
    // Cette fonction sera appelée à chaque changement de langue
    // pour mettre à jour les titres par défaut des notifications
    const updateDefaultTitles = () => {
      // Nous n'avons pas besoin de faire quoi que ce soit ici car les titres
      // sont traduits au moment de l'affichage de la notification
    };
    
    // Appeler la fonction une fois au montage
    updateDefaultTitles();
    
    // Pas besoin de nettoyer car nous n'avons pas d'écouteur d'événement
  }, [t]);
  
  // Afficher un indicateur de chargement pendant l'initialisation
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <>{children}</>;
}

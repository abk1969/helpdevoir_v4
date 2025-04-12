import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Bell, X } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import TouchFeedback from '../common/TouchFeedback';

interface NotificationListProps {
  onClose: () => void;
}

export default function NotificationList({ onClose }: NotificationListProps) {
  const { notifications, markAllAsRead, deleteNotification, markAsRead, clearAll } = useNotificationStore();

  if (notifications.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <TouchFeedback onClick={onClose}>
            <div className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </div>
          </TouchFeedback>
        </div>
        <div className="text-center py-8">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucune notification</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh] flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <TouchFeedback onClick={onClose}>
            <div className="p-1 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </div>
          </TouchFeedback>
        </div>
        <div className="flex justify-between">
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Tout marquer comme lu
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Tout effacer
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 border-b ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <TouchFeedback onClick={() => markAsRead(notification.id)}>
                    <div className="p-1 hover:bg-gray-100 rounded-full">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  </TouchFeedback>
                )}
                <TouchFeedback onClick={() => deleteNotification(notification.id)}>
                  <div className="p-1 hover:bg-gray-100 rounded-full">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </div>
                </TouchFeedback>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
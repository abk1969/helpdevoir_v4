import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../../store/notificationStore';
import NotificationList from './NotificationList';
import TouchFeedback from '../common/TouchFeedback';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <div className="relative">
      <TouchFeedback onClick={() => setIsOpen(!isOpen)}>
        <div className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
      </TouchFeedback>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <NotificationList onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, Settings, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import TouchFeedback from '../common/TouchFeedback';

export function MobileNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Accueil' },
    { path: '/students', icon: Users, label: 'Élèves' },
    { path: '/community', icon: MessageSquare, label: 'Communauté' },
    { path: '/subjects', icon: BookOpen, label: 'Matières' },
    { path: '/settings', icon: Settings, label: 'Paramètres' }
  ];

  const navVariants = {
    hidden: { y: 100 },
    visible: { y: 0 }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden pb-safe-bottom"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <TouchFeedback key={item.path}>
              <Link
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            </TouchFeedback>
          );
        })}
      </div>
    </motion.nav>
  );
}
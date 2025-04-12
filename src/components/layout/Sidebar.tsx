import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
  Home, 
  Users, 
  BookOpen, 
  Settings, 
  Crown,
  Bell,
  MessageSquare,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const location = useLocation();
  const { parent } = useAuthStore();
  const isPremium = parent?.subscription?.plan === 'premium';
  const [isCollapsed, setIsCollapsed] = useState(true); // Set to true by default

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Tableau de bord' },
    { path: '/students', icon: Users, label: 'Élèves' },
    { path: '/community', icon: MessageSquare, label: 'Communauté' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/subscription', icon: Crown, label: 'Abonnement', premiumOnly: true },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
    { path: '/help', icon: HelpCircle, label: 'Aide' }
  ];

  const sidebarVariants = {
    expanded: { 
      width: 256,
      transition: { duration: 0.2 }
    },
    collapsed: { 
      width: 80,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    expanded: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2 }
    },
    collapsed: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const shouldShowMenuItem = (item: typeof menuItems[0]) => {
    if (item.premiumOnly && !isPremium) return false;
    return true;
  };

  return (
    <motion.div
      initial="collapsed"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      variants={sidebarVariants}
      className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden z-30"
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-end p-2">
          <TouchFeedback
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </motion.div>
          </TouchFeedback>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {menuItems.filter(shouldShowMenuItem).map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <TouchFeedback key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        variants={itemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="ml-3 font-medium whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                </TouchFeedback>
              );
            })}
          </AnimatePresence>
        </nav>

        {!isPremium && (
          <motion.div
            variants={itemVariants}
            className="p-4 border-t dark:border-gray-700"
          >
            <Link
              to="/subscription"
              className={`flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all ${
                isCollapsed ? 'px-2' : 'px-4'
              }`}
            >
              <Crown className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <motion.span
                  variants={itemVariants}
                  className="ml-2 whitespace-nowrap"
                >
                  Passer Premium
                </motion.span>
              )}
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
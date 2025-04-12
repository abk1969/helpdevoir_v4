import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Menu, Sun, Moon, Settings, LogOut, ArrowLeft, Home } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';
import NotificationBell from '../notifications/NotificationBell';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { parent, logout } = useAuthStore();

  const showBackButton = location.pathname !== '/dashboard' && location.pathname !== '/';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton ? (
            <TouchFeedback onClick={() => navigate(-1)}>
              <div className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Retour</span>
              </div>
            </TouchFeedback>
          ) : (
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl text-indigo-600 dark:text-indigo-400">📚</span>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Help Devoir</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {parent && (
            <>
              <TouchFeedback onClick={() => navigate('/dashboard')}>
                <div className="flex items-center text-gray-600 hover:text-gray-900">
                  <Home className="h-5 w-5" />
                </div>
              </TouchFeedback>

              <NotificationBell />

              <TouchFeedback onClick={() => navigate('/settings')}>
                <div className="flex items-center text-gray-600 hover:text-gray-900">
                  <Settings className="h-5 w-5" />
                </div>
              </TouchFeedback>
            </>
          )}

          <TouchFeedback onClick={toggleDarkMode}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </div>
          </TouchFeedback>

          {parent && (
            <TouchFeedback onClick={handleLogout}>
              <div className="flex items-center text-red-600 hover:text-red-700">
                <LogOut className="h-5 w-5" />
              </div>
            </TouchFeedback>
          )}
        </div>
      </div>
    </header>
  );
}
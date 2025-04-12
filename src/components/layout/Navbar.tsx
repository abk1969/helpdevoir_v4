import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, BookOpen, Users, Crown } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { parent, logout } = useAuthStore();
  const isPremiumActive = parent?.subscription?.plan === 'premium' && parent?.subscription?.status === 'active';

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex items-center">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Help Devoir</span>
            </Link>
          </div>

          {parent && (
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Tableau de bord
                </span>
              </Link>
              
              <Link
                to="/students"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Étudiants
                </span>
              </Link>

              <Link
                to="/subscription"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isPremiumActive
                    ? 'text-purple-600 hover:text-purple-800'
                    : 'text-gray-700 hover:text-gray-900'
                } hover:bg-gray-50`}
              >
                <span className="flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  {isPremiumActive ? 'Premium Actif' : 'Passer à Premium'}
                </span>
              </Link>

              <div className="flex items-center ml-4">
                <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-700">
                  <User className="h-5 w-5 inline mr-2" />
                  {parent.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-900 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
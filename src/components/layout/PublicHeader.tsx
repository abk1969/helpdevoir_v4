import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LogIn } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold">Help Devoir</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to="/register"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Connexion
          </Link>
        </div>
      </div>
    </header>
  );
}
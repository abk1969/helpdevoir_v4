import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, ArrowLeft, Home } from 'lucide-react';
import TouchFeedback from '../components/common/TouchFeedback';

export default function LegalNotice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation fixe */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <TouchFeedback onClick={() => navigate(-1)}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Retour</span>
            </div>
          </TouchFeedback>

          <TouchFeedback onClick={() => navigate('/')}>
            <div className="flex items-center text-gray-600 hover:text-gray-900">
              <Home className="h-5 w-5 mr-2" />
              <span>Accueil</span>
            </div>
          </TouchFeedback>
        </div>
      </div>

      {/* Contenu avec padding-top pour compenser la barre fixe */}
      <div className="max-w-4xl mx-auto py-12 px-4 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions Légales</h1>

        <div className="space-y-8">
          {/* Reste du contenu inchangé */}
          {/* ... */}
        </div>

        {/* Bouton de retour en bas */}
        <div className="flex justify-center mt-8">
          <TouchFeedback onClick={() => navigate(-1)}>
            <div className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Retour à la page précédente
            </div>
          </TouchFeedback>
        </div>
      </div>
    </div>
  );
}
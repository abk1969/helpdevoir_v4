import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Brain, Users, Clock } from 'lucide-react';
import SubscriptionPlans from '../components/subscription/SubscriptionPlans';

export default function LandingPage() {
  const navigate = useNavigate();

  const additionalServices = [
    {
      name: "Tutorat à distance",
      description: "Cours particuliers en visioconférence avec des enseignants certifiés",
      price: "25€/heure",
      icon: Users
    },
    {
      name: "Tutorat à domicile",
      description: "Cours particuliers chez vous avec des enseignants certifiés",
      price: "35€/heure",
      icon: GraduationCap
    },
    {
      name: "Pack de crédits tutorat",
      description: "10 heures de tutorat à utiliser quand vous voulez",
      price: "200€",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="pt-20 pb-16 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Help Devoir
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          La solution complète pour accompagner la réussite scolaire de vos enfants
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Commencer gratuitement
        </button>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Suivi personnalisé</h3>
              <p className="text-gray-600">Accompagnement adapté au niveau de chaque enfant</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Organisation efficace</h3>
              <p className="text-gray-600">Gestion simple des devoirs et du planning</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progression continue</h3>
              <p className="text-gray-600">Suivi des progrès et statistiques détaillées</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Choisissez votre formule</h2>
          <SubscriptionPlans />
        </div>
      </div>

      {/* Services à la carte */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Services à la carte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.name} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-3 text-xl font-semibold">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à accompagner la réussite de vos enfants ?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Rejoignez des milliers de parents qui font confiance à Help Devoir
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Commencer maintenant
          </button>
        </div>
      </div>
    </div>
  );
}
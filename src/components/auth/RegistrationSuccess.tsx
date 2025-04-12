import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, UserPlus, BookOpen, Settings } from 'lucide-react';

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Ajouter un étudiant",
      description: "Commencez par ajouter votre premier étudiant",
      icon: UserPlus,
      action: () => navigate('/students/add')
    },
    {
      title: "Explorer le tableau de bord",
      description: "Découvrez toutes les fonctionnalités",
      icon: BookOpen,
      action: () => navigate('/dashboard')
    },
    {
      title: "Personnaliser les paramètres",
      description: "Configurez l'application selon vos besoins",
      icon: Settings,
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Inscription réussie !
          </h1>
          <p className="text-lg text-gray-600">
            Bienvenue sur Help Devoir. Commençons par configurer votre compte.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={step.action}
                className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
}
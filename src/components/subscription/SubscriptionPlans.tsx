import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle2, Star, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import TouchFeedback from '../common/TouchFeedback';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  icon: typeof Shield;
  color: string;
  buttonColor: string;
  hoverColor: string;
}

interface SubscriptionPlansProps {
  onPlanSelect?: (planId: string) => void;
  showCurrentPlan?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'freemium',
    name: 'Freemium',
    price: '0',
    period: 'mois',
    icon: Shield,
    color: 'bg-gray-50 border-gray-200',
    buttonColor: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700',
    features: [
      '1 enfant',
      'Suivi des devoirs (limité à 5 devoirs/mois)',
      '1 rappel email par semaine',
      'Accès au forum communautaire',
      'Articles pédagogiques gratuits'
    ]
  },
  {
    id: 'essential',
    name: 'Essentiel',
    price: '9.99',
    period: 'mois',
    icon: Sparkles,
    color: 'bg-blue-50 border-blue-200',
    buttonColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    features: [
      '1 enfant',
      'Suivi des devoirs illimité',
      'Rappels quotidiens par email',
      'Support par email sous 24h',
      '2 crédits tutorat inclus',
      'Réduction sur les services à la carte'
    ]
  },
  {
    id: 'family',
    name: 'Famille',
    price: '19.99',
    period: 'mois',
    popular: true,
    icon: Star,
    color: 'bg-indigo-50 border-indigo-200',
    buttonColor: 'bg-indigo-600',
    hoverColor: 'hover:bg-indigo-700',
    features: [
      '3 enfants',
      'Suivi des devoirs illimité',
      'Rappels par email et SMS',
      'Support prioritaire',
      '5 crédits tutorat inclus',
      'Partage avec les enseignants',
      'Statistiques détaillées',
      '-20% sur les services à la carte'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '29.99',
    period: 'mois',
    icon: Zap,
    color: 'bg-purple-50 border-purple-200',
    buttonColor: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    features: [
      'Enfants illimités',
      'Toutes les fonctionnalités Famille',
      'Correction IA des devoirs',
      '10 crédits tutorat inclus',
      'Tutorat prioritaire',
      'Ressources pédagogiques premium',
      'Support 24/7 prioritaire',
      '-30% sur les services à la carte'
    ]
  }
];

export default function SubscriptionPlans({ onPlanSelect, showCurrentPlan = false }: SubscriptionPlansProps) {
  const navigate = useNavigate();
  const { parent } = useAuthStore();
  const currentPlan = parent?.subscription?.plan;

  const handlePlanSelection = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
      {subscriptionPlans.map((plan) => {
        const Icon = plan.icon;
        const isCurrentPlan = showCurrentPlan && currentPlan === plan.id;
        
        return (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-xl border-2 ${plan.color} ${
              plan.popular ? 'ring-2 ring-indigo-600' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 right-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white shadow-lg">
                  <Star className="h-4 w-4 mr-1" />
                  Populaire
                </span>
              </div>
            )}

            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <Icon className="h-6 w-6 text-gray-500" />
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}€</span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-6 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <TouchFeedback onClick={() => handlePlanSelection(plan.id)}>
                <button
                  disabled={isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-lg text-white font-medium ${plan.buttonColor} ${
                    !isCurrentPlan && plan.hoverColor
                  } transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCurrentPlan ? 'Abonnement actuel' : (
                    plan.price === "0" ? 'Commencer gratuitement' : `Choisir ${plan.name}`
                  )}
                </button>
              </TouchFeedback>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
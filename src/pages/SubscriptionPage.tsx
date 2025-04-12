import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SubscriptionPlans from '../components/subscription/SubscriptionPlans';
import PageContainer from '../components/common/PageContainer';

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const { parent, updateSubscription } = useAuthStore();

  const handleSubscribe = async (planId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (planId === 'freemium') {
        updateSubscription({
          plan: 'freemium',
          status: 'active'
        });
        toast.success('Plan Freemium activé !');
      } else {
        updateSubscription({
          plan: planId as 'essential' | 'family' | 'premium',
          status: 'active'
        });
        toast.success('Abonnement activé avec succès !');
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de l\'activation de l\'abonnement');
    }
  };

  return (
    <PageContainer
      title="Abonnement"
      showBack
      onBack={() => navigate(-1)}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sélectionnez l'abonnement qui correspond le mieux à vos besoins et profitez de toutes les fonctionnalités de Help Devoir
          </p>
        </div>

        {parent?.subscription && (
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800">
              Vous avez déjà un abonnement {parent.subscription.plan}. Changer de formule mettra à jour votre abonnement.
            </p>
          </div>
        )}

        <SubscriptionPlans onPlanSelect={handleSubscribe} showCurrentPlan={true} />

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Tous les prix sont en euros TTC. Vous pouvez changer ou annuler votre abonnement à tout moment.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
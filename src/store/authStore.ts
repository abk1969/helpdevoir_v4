import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Parent } from '../types';
import { authService } from '../services';

interface AuthState {
  parent: Parent | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateSubscription: (subscription: Parent['subscription']) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      parent: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await authService.login({ email, password });
          set({ parent: response.parent, isAuthenticated: true });
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          throw error;
        }
      },
      logout: async () => {
        try {
          await authService.logout();
          set({ parent: null, isAuthenticated: false });
        } catch (error) {
          console.error('Erreur lors de la déconnexion:', error);
          set({ parent: null, isAuthenticated: false });
        }
      },
      updateSubscription: async (subscription) => {
        try {
          if (!useAuthStore.getState().parent) return;

          const updatedParent = await authService.updateSubscription(subscription);
          set((state) => ({
            parent: {
              ...state.parent,
              ...updatedParent,
              subscription,
              isPremium: subscription.plan === 'premium'
            }
          }));
        } catch (error) {
          console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
          throw error;
        }
      }
    }),
    {
      name: 'auth-storage',
      version: 1
    }
  )
);
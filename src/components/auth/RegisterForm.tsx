import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation et la politique de confidentialité'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Inscription réussie !');
      navigate('/registration-success');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
              J'accepte les{' '}
              <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                conditions d'utilisation
              </Link>{' '}
              et la{' '}
              <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                politique de confidentialité
              </Link>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div className="text-sm text-blue-700">
              <p className="mb-2">
                Vos données personnelles sont traitées par Help Devoir conformément à notre politique de confidentialité.
              </p>
              <p>
                Pour toute question relative à vos données personnelles, contactez notre DPO à{' '}
                <a href="mailto:dpo@helpdevoir.globacom3000.com" className="underline hover:text-blue-800">
                  dpo@helpdevoir.globacom3000.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}
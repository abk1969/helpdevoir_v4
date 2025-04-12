import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useStudentStore } from '../../store/studentStore';
import { GradeLevel } from '../../types';
import { Brain, Ear, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import TouchFeedback from '../common/TouchFeedback';

const gradeLevels = [
  "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème",
  "Seconde", "Première", "Terminale"
] as const;

const studentSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  age: z.number().min(6, 'L\'âge minimum est de 6 ans').max(18, 'L\'âge maximum est de 18 ans'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  gradeLevel: z.enum(gradeLevels, {
    required_error: 'Veuillez sélectionner un niveau',
    invalid_type_error: 'Niveau invalide'
  }),
  hasDyslexia: z.boolean().default(false),
  hearingImpaired: z.boolean().default(false),
  visuallyImpaired: z.boolean().default(false)
});

type StudentFormData = z.infer<typeof studentSchema>;

export default function AddStudentForm() {
  const navigate = useNavigate();
  const { addStudent } = useStudentStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      hasDyslexia: false,
      hearingImpaired: false,
      visuallyImpaired: false,
      age: 12
    }
  });

  const onSubmit = async (data: StudentFormData) => {
    try {
      const student = await addStudent(data);
      toast.success(`${data.firstName} a été ajouté(e) avec succès !`);
      navigate(`/students/${student.id}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Ajouter un étudiant</h2>
        <TouchFeedback onClick={() => navigate('/students')}>
          <div className="text-gray-600 hover:text-gray-900">
            Annuler
          </div>
        </TouchFeedback>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Prénom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prénom
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="Prénom de l'étudiant"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Âge */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Âge
          </label>
          <input
            type="number"
            {...register('age', { valueAsNumber: true })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (optionnel)
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="email@exemple.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Niveau scolaire */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Niveau scolaire
          </label>
          <select
            {...register('gradeLevel')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sélectionnez un niveau</option>
            {gradeLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.gradeLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.gradeLevel.message}</p>
          )}
        </div>

        {/* Besoins spécifiques */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Besoins spécifiques</h3>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('hasDyslexia')}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label className="flex items-center text-sm text-gray-700">
              <Brain className="h-5 w-5 text-purple-600 mr-2" />
              Dyslexie
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('hearingImpaired')}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label className="flex items-center text-sm text-gray-700">
              <Ear className="h-5 w-5 text-blue-600 mr-2" />
              Malentendant
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('visuallyImpaired')}
              className="h-4 w-4 text-indigo-600 rounded"
            />
            <label className="flex items-center text-sm text-gray-700">
              <Eye className="h-5 w-5 text-green-600 mr-2" />
              Malvoyant
            </label>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-6">
          <TouchFeedback onClick={() => navigate('/students')}>
            <div className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">
              Annuler
            </div>
          </TouchFeedback>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Ajouter l\'étudiant'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
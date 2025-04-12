import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubjectStore } from '../../store/subjectStore';
import { Book, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { GradeLevel } from '../../types';
import { iconMap } from '../../data/subjects';
import TouchFeedback from '../common/TouchFeedback';

const subjectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  icon: z.string(),
  color: z.string(),
  gradeLevel: z.string(),
  description: z.string().optional()
});

type SubjectFormData = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  onSubmit: (data: SubjectFormData) => void;
  onCancel: () => void;
  gradeLevel: GradeLevel;
}

const colorOptions = [
  { value: 'bg-blue-600', label: 'Bleu' },
  { value: 'bg-red-600', label: 'Rouge' },
  { value: 'bg-green-600', label: 'Vert' },
  { value: 'bg-purple-600', label: 'Violet' },
  { value: 'bg-yellow-600', label: 'Jaune' },
  { value: 'bg-pink-600', label: 'Rose' }
];

export default function SubjectForm({ onSubmit, onCancel, gradeLevel }: SubjectFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      gradeLevel,
      icon: 'Book',
      color: 'bg-blue-600'
    }
  });

  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  const handleFormSubmit = async (data: SubjectFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erreur lors de la création de la matière:', error);
      toast.error('Erreur lors de la création de la matière');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Ajouter une matière</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de la matière
          </label>
          <input
            {...register('name')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: Mathématiques"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icône
          </label>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(iconMap).map(([name, Icon]) => (
              <TouchFeedback
                key={name}
                onClick={() => setValue('icon', name)}
              >
                <div className={`p-4 rounded-lg flex items-center justify-center ${
                  selectedIcon === name 
                    ? 'bg-indigo-100 ring-2 ring-indigo-500' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
              </TouchFeedback>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Couleur
          </label>
          <div className="grid grid-cols-3 gap-4">
            {colorOptions.map((color) => (
              <TouchFeedback
                key={color.value}
                onClick={() => setValue('color', color.value)}
              >
                <div className={`p-4 rounded-lg flex items-center justify-center ${color.value} ${
                  selectedColor === color.value 
                    ? 'ring-2 ring-indigo-500' 
                    : ''
                }`}>
                  <span className="text-white">{color.label}</span>
                </div>
              </TouchFeedback>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optionnelle)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="Description de la matière..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <TouchFeedback onClick={onCancel}>
            <div className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">
              Annuler
            </div>
          </TouchFeedback>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Ajouter la matière'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
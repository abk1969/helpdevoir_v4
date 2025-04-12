import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

const homeworkSchema = z.object({
  title: z.string().min(2, 'Le titre est requis'),
  description: z.string().min(10, 'La description est requise'),
  dueDate: z.string().min(1, 'La date limite est requise'),
  estimatedTime: z.string().optional()
});

type HomeworkFormData = z.infer<typeof homeworkSchema>;

interface HomeworkFormProps {
  studentId: string;
  subjectId: string;
  onSubmit: (data: HomeworkFormData) => void;
  onCancel: () => void;
}

export default function HomeworkForm({
  studentId,
  subjectId,
  onSubmit,
  onCancel
}: HomeworkFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<HomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      estimatedTime: '30'
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <TouchFeedback onClick={onCancel}>
          <div className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </div>
        </TouchFeedback>
        <h2 className="text-2xl font-bold text-gray-900">Nouveau devoir</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre
          </label>
          <input
            {...register('title')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="Titre du devoir"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            placeholder="Description du devoir"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Date limite
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Temps estimé (en minutes)
            </label>
            <input
              type="number"
              {...register('estimatedTime')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              placeholder="30"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <TouchFeedback onClick={onCancel}>
            <div className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">
              Annuler
            </div>
          </TouchFeedback>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Créer le devoir
          </button>
        </div>
      </form>
    </motion.div>
  );
}
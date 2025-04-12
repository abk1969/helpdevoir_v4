import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  Eye,
  Volume2,
  Mic,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  ArrowLeft,
  Calendar,
  Clock,
  Settings,
  Lightbulb
} from 'lucide-react';
import { useHomeworkStore } from '../../store/homeworkStore';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

const homeworkSchema = z.object({
  title: z.string().min(2, 'Le titre est requis'),
  description: z.string().min(10, 'La description est requise'),
  dueDate: z.string().min(1, 'La date limite est requise'),
  estimatedTime: z.string().optional(),
  fontSize: z.number().min(16).max(32).default(20),
  contrast: z.number().min(100).max(200).default(150),
  isDarkMode: z.boolean().default(false),
  audioDescription: z.string().optional()
});

type VisualImpairedHomeworkFormData = z.infer<typeof homeworkSchema>;

interface VisualImpairedHomeworkFormProps {
  studentId: string;
  subjectId: string;
  onSubmit: (data: VisualImpairedHomeworkFormData) => void;
  onCancel: () => void;
}

export default function VisualImpairedHomeworkForm({
  studentId,
  subjectId,
  onSubmit,
  onCancel
}: VisualImpairedHomeworkFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { addHomework } = useHomeworkStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VisualImpairedHomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      fontSize: 20,
      contrast: 150,
      isDarkMode: false,
      estimatedTime: '30'
    }
  });

  const currentFontSize = watch('fontSize');
  const currentContrast = watch('contrast');
  const isDarkMode = watch('isDarkMode');

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecognition = (field: 'title' | 'description' | 'audioDescription') => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      
      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue(field, transcript);
      };

      recognition.start();
    } else {
      toast.error('La reconnaissance vocale n\'est pas supportée par votre navigateur');
    }
  };

  const handleFormSubmit = async (data: VisualImpairedHomeworkFormData) => {
    try {
      await addHomework({
        ...data,
        studentId,
        subjectId,
        visualImpairedSettings: {
          fontSize: data.fontSize,
          contrast: data.contrast,
          isDarkMode: data.isDarkMode,
          hasAudioDescription: !!data.audioDescription
        }
      });
      onSubmit(data);
      toast.success('Devoir créé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la création du devoir');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${
        isDarkMode ? 'dark bg-gray-900' : ''
      }`}
      style={{ 
        filter: `contrast(${currentContrast}%)`,
        fontSize: `${currentFontSize}px`
      }}
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <TouchFeedback onClick={onCancel}>
          <div className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </div>
        </TouchFeedback>
        <div className="flex items-center">
          <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nouveau devoir adapté
          </h2>
        </div>
      </div>

      {/* Paramètres d'accessibilité */}
      <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Taille du texte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ZoomIn className="h-4 w-4 mr-2 inline" />
              Taille du texte
            </label>
            <div className="flex items-center space-x-2">
              <TouchFeedback onClick={() => setValue('fontSize', Math.max(16, currentFontSize - 2))}>
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                  <ZoomOut className="h-4 w-4" />
                </div>
              </TouchFeedback>
              <input
                type="range"
                min="16"
                max="32"
                step="2"
                value={currentFontSize}
                onChange={(e) => setValue('fontSize', Number(e.target.value))}
                className="flex-1"
              />
              <TouchFeedback onClick={() => setValue('fontSize', Math.min(32, currentFontSize + 2))}>
                <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </TouchFeedback>
            </div>
          </div>

          {/* Contraste */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Settings className="h-4 w-4 mr-2 inline" />
              Contraste
            </label>
            <input
              type="range"
              min="100"
              max="200"
              value={currentContrast}
              onChange={(e) => setValue('contrast', Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Mode sombre/clair */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Sun className="h-4 w-4 mr-2 inline" />
              Mode d'affichage
            </label>
            <TouchFeedback onClick={() => setValue('isDarkMode', !isDarkMode)}>
              <div className="flex items-center justify-center p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </div>
            </TouchFeedback>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titre
          </label>
          <div className="relative">
            <input
              {...register('title')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Titre du devoir"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
              <TouchFeedback onClick={() => startVoiceRecognition('title')}>
                <div className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Mic className="h-4 w-4" />
                </div>
              </TouchFeedback>
              <TouchFeedback onClick={() => readText(watch('title'))}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Volume2 className="h-4 w-4" />
                </div>
              </TouchFeedback>
            </div>
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <div className="relative">
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Description du devoir"
            />
            <div className="absolute right-2 bottom-2 flex space-x-2">
              <TouchFeedback onClick={() => startVoiceRecognition('description')}>
                <div className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Mic className="h-4 w-4" />
                </div>
              </TouchFeedback>
              <TouchFeedback onClick={() => readText(watch('description'))}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Volume2 className="h-4 w-4" />
                </div>
              </TouchFeedback>
            </div>
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Description audio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description audio complémentaire
          </label>
          <div className="relative">
            <textarea
              {...register('audioDescription')}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="Description audio additionnelle"
            />
            <div className="absolute right-2 bottom-2 flex space-x-2">
              <TouchFeedback onClick={() => startVoiceRecognition('audioDescription')}>
                <div className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}>
                  <Mic className="h-4 w-4" />
                </div>
              </TouchFeedback>
              <TouchFeedback onClick={() => readText(watch('audioDescription') || '')}>
                <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Volume2 className="h-4 w-4" />
                </div>
              </TouchFeedback>
            </div>
          </div>
        </div>

        {/* Date et temps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="h-4 w-4 mr-2 inline" />
              Date limite
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dueDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="h-4 w-4 mr-2 inline" />
              Temps estimé (en minutes)
            </label>
            <input
              type="number"
              {...register('estimatedTime')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              placeholder="30"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <TouchFeedback onClick={onCancel}>
            <div className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
              Annuler
            </div>
          </TouchFeedback>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Créer le devoir
          </button>
        </div>
      </form>
    </motion.div>
  );
}
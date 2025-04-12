import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Volume2, 
  Mic,
  Type,
  Palette,
  Lightbulb,
  Brain,
  Clock,
  Calendar
} from 'lucide-react';
import { useHomeworkStore } from '../../store/homeworkStore';
import { useAccessibilityStore } from '../../store/accessibilityStore';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

const homeworkSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  dueDate: z.string().min(1, 'La date limite est requise'),
  estimatedTime: z.string().optional(),
  fontSize: z.number().min(14).max(24).default(18),
  colorScheme: z.enum(['cream', 'blue', 'yellow']).default('cream'),
  lineSpacing: z.number().min(1.5).max(3).default(2)
});

type DyslexiaHomeworkFormData = z.infer<typeof homeworkSchema>;

interface DyslexiaHomeworkFormProps {
  studentId: string;
  subjectId: string;
  onSubmit: (data: DyslexiaHomeworkFormData) => void;
  onCancel: () => void;
}

const colorSchemes = [
  { id: 'cream', name: 'Crème', bg: 'bg-[#f5f5dc]', text: 'text-gray-900' },
  { id: 'blue', name: 'Bleu clair', bg: 'bg-[#e6f3ff]', text: 'text-gray-900' },
  { id: 'yellow', name: 'Jaune pâle', bg: 'bg-[#fafad2]', text: 'text-gray-900' }
];

export default function DyslexiaHomeworkForm({
  studentId,
  subjectId,
  onSubmit,
  onCancel
}: DyslexiaHomeworkFormProps) {
  const [isRecording, setIsRecording] = useState(false);
  const { isDyslexiaMode } = useAccessibilityStore();
  const { addHomework } = useHomeworkStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DyslexiaHomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      estimatedTime: '30',
      fontSize: 18,
      colorScheme: 'cream',
      lineSpacing: 2
    }
  });

  const currentFontSize = watch('fontSize');
  const currentColorScheme = watch('colorScheme');
  const currentLineSpacing = watch('lineSpacing');

  const startVoiceRecognition = (field: 'title' | 'description') => {
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

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  };

  const handleFormSubmit = async (data: DyslexiaHomeworkFormData) => {
    try {
      await addHomework({
        ...data,
        studentId,
        subjectId,
        dyslexiaSettings: {
          fontSize: data.fontSize,
          colorScheme: data.colorScheme,
          lineSpacing: data.lineSpacing
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
      className={`bg-white rounded-xl shadow-lg p-6 ${isDyslexiaMode ? 'font-dyslexic' : ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <TouchFeedback onClick={onCancel}>
          <div className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </div>
        </TouchFeedback>
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Nouveau devoir adapté</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Titre */}
        <div className="relative">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Type className="h-4 w-4 mr-2" />
            Titre
          </label>
          <div className="relative">
            <input
              {...register('title')}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 ${
                currentColorScheme === 'cream' ? 'bg-[#f5f5dc]' : 
                currentColorScheme === 'blue' ? 'bg-[#e6f3ff]' : 'bg-[#fafad2]'
              }`}
              style={{ 
                fontSize: `${currentFontSize}px`,
                lineHeight: currentLineSpacing
              }}
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
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Lightbulb className="h-4 w-4 mr-2" />
            Description
          </label>
          <div className="relative">
            <textarea
              {...register('description')}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 ${
                currentColorScheme === 'cream' ? 'bg-[#f5f5dc]' : 
                currentColorScheme === 'blue' ? 'bg-[#e6f3ff]' : 'bg-[#fafad2]'
              }`}
              style={{ 
                fontSize: `${currentFontSize}px`,
                lineHeight: currentLineSpacing
              }}
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
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Paramètres d'accessibilité */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Paramètres d'affichage</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Taille du texte */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4 mr-2" />
                Taille du texte
              </label>
              <input
                type="range"
                min="14"
                max="24"
                step="1"
                {...register('fontSize', { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>14px</span>
                <span>{currentFontSize}px</span>
                <span>24px</span>
              </div>
            </div>

            {/* Espacement des lignes */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4 mr-2" />
                Espacement des lignes
              </label>
              <input
                type="range"
                min="1.5"
                max="3"
                step="0.5"
                {...register('lineSpacing', { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1.5</span>
                <span>{currentLineSpacing}</span>
                <span>3.0</span>
              </div>
            </div>

            {/* Schéma de couleurs */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-4 w-4 mr-2" />
                Couleur de fond
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorSchemes.map((scheme) => (
                  <TouchFeedback
                    key={scheme.id}
                    onClick={() => setValue('colorScheme', scheme.id as any)}
                  >
                    <div className={`p-2 rounded-lg ${scheme.bg} ${scheme.text} text-center text-sm ${
                      currentColorScheme === scheme.id ? 'ring-2 ring-purple-500' : ''
                    }`}>
                      {scheme.name}
                    </div>
                  </TouchFeedback>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Date et temps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Date limite
            </label>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              Temps estimé (en minutes)
            </label>
            <input
              type="number"
              {...register('estimatedTime')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              placeholder="30"
            />
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <TouchFeedback onClick={onCancel}>
            <div className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">
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
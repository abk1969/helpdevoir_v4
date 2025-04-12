import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Ear,
  HandMetal,
  Video,
  Image as ImageIcon,
  Upload,
  Lightbulb,
  Plus,
  X,
  Clock,
  Calendar
} from 'lucide-react';
import { useHomeworkStore } from '../../store/homeworkStore';
import TouchFeedback from '../common/TouchFeedback';
import SignLanguageRecorder from '../hearing/SignLanguageRecorder';
import VisualInstructionEditor from '../hearing/VisualInstructionEditor';
import toast from 'react-hot-toast';

const homeworkSchema = z.object({
  title: z.string().min(2, 'Le titre est requis'),
  description: z.string().min(10, 'La description est requise'),
  dueDate: z.string().min(1, 'La date limite est requise'),
  estimatedTime: z.string().optional(),
  visualInstructions: z.array(z.object({
    type: z.enum(['image', 'video', 'signLanguage']),
    url: z.string(),
    description: z.string()
  })).default([]),
  signLanguageVideo: z.string().optional(),
  visualSteps: z.array(z.object({
    title: z.string(),
    content: z.string(),
    image: z.string().optional()
  })).default([])
});

type HearingImpairedHomeworkFormData = z.infer<typeof homeworkSchema>;

interface HearingImpairedHomeworkFormProps {
  studentId: string;
  subjectId: string;
  onSubmit: (data: HearingImpairedHomeworkFormData) => void;
  onCancel: () => void;
}

export default function HearingImpairedHomeworkForm({
  studentId,
  subjectId,
  onSubmit,
  onCancel
}: HearingImpairedHomeworkFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRecordingSign, setIsRecordingSign] = useState(false);
  const [visualSteps, setVisualSteps] = useState<Array<{
    title: string;
    content: string;
    image?: string;
  }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addHomework } = useHomeworkStore();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<HearingImpairedHomeworkFormData>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      estimatedTime: '30',
      visualInstructions: [],
      visualSteps: []
    }
  });

  const steps = [
    { id: 'basic', title: 'Informations de base' },
    { id: 'visual', title: 'Instructions visuelles' },
    { id: 'sign', title: 'Langue des signes' },
    { id: 'steps', title: 'Étapes visuelles' },
    { id: 'preview', title: 'Aperçu' }
  ];

  const handleAddVisualStep = () => {
    setVisualSteps([
      ...visualSteps,
      { title: '', content: '' }
    ]);
  };

  const handleRemoveVisualStep = (index: number) => {
    setVisualSteps(visualSteps.filter((_, i) => i !== index));
  };

  const handleUpdateVisualStep = (index: number, field: string, value: string) => {
    const newSteps = [...visualSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setVisualSteps(newSteps);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    const instructions = watch('visualInstructions');
    setValue('visualInstructions', [
      ...instructions,
      {
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: fakeUrl,
        description: ''
      }
    ]);
  };

  const handleSignLanguageRecording = (videoUrl: string) => {
    setValue('signLanguageVideo', videoUrl);
    setIsRecordingSign(false);
  };

  const handleFormSubmit = async (data: HearingImpairedHomeworkFormData) => {
    try {
      await addHomework({
        ...data,
        studentId,
        subjectId,
        visualSteps,
        hearingImpairedSettings: {
          hasSignLanguage: !!data.signLanguageVideo,
          hasVisualInstructions: data.visualInstructions.length > 0,
          hasVisualSteps: visualSteps.length > 0
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
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <TouchFeedback onClick={onCancel}>
          <div className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </div>
        </TouchFeedback>
        <div className="flex items-center">
          <Ear className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Nouveau devoir adapté</h2>
        </div>
      </div>

      {/* Étapes de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : index < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className="text-sm mt-2">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-600 rounded"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Étape 1: Informations de base */}
          {currentStep === 0 && (
            <motion.div
              key="basic"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  {...register('title')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="30"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Étape 2: Instructions visuelles */}
          {currentStep === 1 && (
            <motion.div
              key="visual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-center space-x-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />
                <TouchFeedback onClick={() => fileInputRef.current?.click()}>
                  <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Ajouter une image
                  </div>
                </TouchFeedback>
                <TouchFeedback onClick={() => fileInputRef.current?.click()}>
                  <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <Video className="h-5 w-5 mr-2" />
                    Ajouter une vidéo
                  </div>
                </TouchFeedback>
              </div>

              <VisualInstructionEditor
                instructions={watch('visualInstructions')}
                onChange={(instructions) => setValue('visualInstructions', instructions)}
              />
            </motion.div>
          )}

          {/* Étape 3: Langue des signes */}
          {currentStep === 2 && (
            <motion.div
              key="sign"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                {!isRecordingSign && !watch('signLanguageVideo') && (
                  <TouchFeedback onClick={() => setIsRecordingSign(true)}>
                    <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg">
                      <HandMetal className="h-5 w-5 mr-2" />
                      Enregistrer en langue des signes
                    </div>
                  </TouchFeedback>
                )}

                {isRecordingSign && (
                  <SignLanguageRecorder
                    onRecordingComplete={handleSignLanguageRecording}
                    onCancel={() => setIsRecordingSign(false)}
                  />
                )}

                {watch('signLanguageVideo') && !isRecordingSign && (
                  <div className="relative">
                    <video
                      src={watch('signLanguageVideo')}
                      controls
                      className="w-full rounded-lg"
                    />
                    <TouchFeedback
                      onClick={() => setValue('signLanguageVideo', undefined)}
                      className="absolute top-2 right-2"
                    >
                      <div className="p-2 bg-red-600 text-white rounded-full">
                        <X className="h-4 w-4" />
                      </div>
                    </TouchFeedback>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Étape 4: Étapes visuelles */}
          {currentStep === 3 && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Étapes du devoir</h3>
                <TouchFeedback onClick={handleAddVisualStep}>
                  <div className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter une étape
                  </div>
                </TouchFeedback>
              </div>

              <div className="space-y-4">
                {visualSteps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Étape {index + 1}</h4>
                      <TouchFeedback onClick={() => handleRemoveVisualStep(index)}>
                        <div className="p-1 text-red-600 hover:bg-red-50 rounded-full">
                          <X className="h-4 w-4" />
                        </div>
                      </TouchFeedback>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => handleUpdateVisualStep(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Titre de l'étape"
                      />

                      <textarea
                        value={step.content}
                        onChange={(e) => handleUpdateVisualStep(index, 'content', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Description de l'étape"
                      />

                      <div className="flex items-center space-x-4">
                        <TouchFeedback onClick={() => fileInputRef.current?.click()}>
                          <div className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                            <Upload className="h-5 w-5 mr-2" />
                            Ajouter une image
                          </div>
                        </TouchFeedback>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Étape 5: Aperçu */}
          {currentStep === 4 && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-4">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-blue-900">Résumé du devoir</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-blue-800">Informations générales</h4>
                    <p className="text-blue-700">{watch('title')}</p>
                    <p className="text-blue-600">{watch('description')}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-blue-800">Support visuel</h4>
                    <p className="text-blue-700">
                      {watch('visualInstructions').length} instruction(s) visuelle(s)
                    </p>
                  </div>

                  {watch('signLanguageVideo') && (
                    <div>
                      <h4 className="font-medium text-blue-800">Langue des signes</h4>
                      <p className="text-blue-700">Vidéo en langue des signes incluse</p>
                    </div>
                  )}

                  {visualSteps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-800">Étapes</h4>
                      <p className="text-blue-700">{visualSteps.length} étape(s) détaillée(s)</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation entre les étapes */}
        <div className="flex justify-between pt-6">
          <TouchFeedback
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <div className={`px-6 py-2 rounded-lg ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}>
              Précédent
            </div>
          </TouchFeedback>

          {currentStep === steps.length - 1 ? (
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Créer le devoir
            </button>
          ) : (
            <TouchFeedback onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}>
              <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Suivant
              </div>
            </TouchFeedback>
          )}
        </div>
      </form>
    </motion.div>
  );
}
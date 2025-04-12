```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Upload,
  Image as ImageIcon,
  FileCheck,
  Loader,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { multimodalProcessor, DocumentAnalysisResult } from '../../utils/ai/multimodalProcessor';
import TouchFeedback from '../common/TouchFeedback';
import toast from 'react-hot-toast';

interface DocumentAnalyzerProps {
  onAnalysisComplete: (result: DocumentAnalysisResult) => void;
  onClose: () => void;
}

export default function DocumentAnalyzer({
  onAnalysisComplete,
  onClose
}: DocumentAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supportedFormats = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    if (!supportedFormats.includes(file.type)) {
      toast.error('Format de fichier non supporté');
      return;
    }

    setCurrentFile(file);

    // Créer un aperçu pour les images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);

      // Simuler la progression
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await multimodalProcessor.analyzeDocument(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onAnalysisComplete(result);
      
      toast.success('Analyse terminée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse du document');
      console.error('Erreur:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Analyse de document</h2>
          <TouchFeedback onClick={onClose}>
            <div className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </div>
          </TouchFeedback>
        </div>

        {!isAnalyzing ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors"
          >
            <input
              type="file"
              accept={supportedFormats.join(',')}
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />

            <div className="mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="text-gray-600">
                Glissez-déposez votre document ici ou{' '}
                <label
                  htmlFor="file-input"
                  className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  parcourez
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Formats supportés: Images, PDF, Documents Word
              </p>
            </div>

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="max-h-48 mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Loader className="h-16 w-16 text-indigo-600" />
            </motion.div>
            <p className="text-gray-600 mb-4">Analyse en cours...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div
                className="bg-indigo-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {currentFile?.name}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <TouchFeedback onClick={onClose}>
            <div className="px-4 py-2 text-gray-600">
              Annuler
            </div>
          </TouchFeedback>
        </div>
      </motion.div>
    </div>
  );
}
```
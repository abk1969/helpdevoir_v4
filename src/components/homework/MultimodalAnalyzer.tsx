```typescript
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Image as ImageIcon,
  Table,
  BarChart,
  Brain,
  Loader,
  Check,
  AlertTriangle
} from 'lucide-react';
import { multimodalAnalyzer, MultimodalAnalysisResult } from '../../utils/ai/multimodalAnalyzer';
import TouchFeedback from '../common/TouchFeedback';
import DocumentViewer from './DocumentViewer';
import AIAnalysisResult from './AIAnalysisResult';
import toast from 'react-hot-toast';

interface MultimodalAnalyzerProps {
  onAnalysisComplete: (result: MultimodalAnalysisResult) => void;
  onClose: () => void;
}

export default function MultimodalAnalyzer({
  onAnalysisComplete,
  onClose
}: MultimodalAnalyzerProps) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<MultimodalAnalysisResult | null>(null);

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

    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    try {
      setIsAnalyzing(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await multimodalAnalyzer.analyzeDocument(file);
      
      clearInterval(progressInterval);
      setProgress(100);
      setAnalysisResult(result);
      
      onAnalysisComplete(result);
      toast.success('Analyse terminée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse du document');
      console.error('Erreur:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVisualElementIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'table':
        return <Table className="h-5 w-5" />;
      case 'graph':
        return <BarChart className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold">Analyse Multimodale</h2>
          </div>
          <TouchFeedback onClick={onClose}>
            <div className="p-2 hover:bg-gray-100 rounded-full">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </TouchFeedback>
        </div>

        {!isAnalyzing && !analysisResult ? (
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
                <FileText className="h-8 w-8 text-indigo-600" />
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
          </div>
        ) : isAnalyzing ? (
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
        ) : (
          <div className="space-y-6">
            {previewUrl && (
              <DocumentViewer
                url={previewUrl}
                type={currentFile?.type.startsWith('image/') ? 'image' : 'document'}
              />
            )}

            {analysisResult && (
              <div className="space-y-6">
                <AIAnalysisResult
                  result={{
                    text: analysisResult.text,
                    confidence: analysisResult.confidence,
                    model: analysisResult.metadata.model,
                    processingTime: analysisResult.metadata.processingTime
                  }}
                />

                {analysisResult.visualElements && analysisResult.visualElements.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Éléments visuels détectés</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analysisResult.visualElements.map((element, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-white rounded-lg"
                        >
                          {getVisualElementIcon(element.type)}
                          <div>
                            <h4 className="font-medium">{element.type}</h4>
                            <p className="text-sm text-gray-600">
                              {element.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
```
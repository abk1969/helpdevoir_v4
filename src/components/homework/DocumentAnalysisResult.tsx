import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Languages,
  FileType
} from 'lucide-react';
import { DocumentAnalysisResult } from '../../utils/ai/multimodalProcessor';

interface DocumentAnalysisResultProps {
  result: DocumentAnalysisResult;
}

export default function DocumentAnalysisResultView({
  result
}: DocumentAnalysisResultProps) {
  const getConfidenceColor = () => {
    if (result.confidence >= 0.9) return 'text-green-600';
    if (result.confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-medium">Résultat de l'analyse</h3>
        </div>
        <div className={`flex items-center ${getConfidenceColor()}`}>
          {result.confidence >= 0.7 ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          <span className="font-medium">
            {Math.round(result.confidence * 100)}% de confiance
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Métadonnées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <FileType className="h-4 w-4 mr-1" />
              Format
            </div>
            <div className="font-medium">{result.metadata.format}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Clock className="h-4 w-4 mr-1" />
              Temps de traitement
            </div>
            <div className="font-medium">
              {(result.metadata.processingTime / 1000).toFixed(2)}s
            </div>
          </div>

          {result.metadata.language && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Languages className="h-4 w-4 mr-1" />
                Langue
              </div>
              <div className="font-medium">{result.metadata.language}</div>
            </div>
          )}

          {result.metadata.pageCount && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FileText className="h-4 w-4 mr-1" />
                Pages
              </div>
              <div className="font-medium">{result.metadata.pageCount}</div>
            </div>
          )}
        </div>

        {/* Contenu extrait */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Contenu extrait</h4>
          <div className="prose max-w-none">
            {result.text.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
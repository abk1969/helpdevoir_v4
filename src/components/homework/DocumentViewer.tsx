import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download,
  Share2,
  Printer,
  Eye
} from 'lucide-react';
import TouchFeedback from '../common/TouchFeedback';

interface DocumentViewerProps {
  url: string;
  type: 'image' | 'pdf' | 'document';
  onShare?: () => void;
}

export default function DocumentViewer({
  url,
  type,
  onShare
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `document.${type === 'image' ? 'jpg' : type}`;
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open(url, '_blank');
    printWindow?.print();
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <div className="flex space-x-2">
          <TouchFeedback onClick={handleZoomIn}>
            <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <ZoomIn className="h-5 w-5 text-white" />
            </div>
          </TouchFeedback>
          <TouchFeedback onClick={handleZoomOut}>
            <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <ZoomOut className="h-5 w-5 text-white" />
            </div>
          </TouchFeedback>
          <TouchFeedback onClick={handleRotate}>
            <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <RotateCw className="h-5 w-5 text-white" />
            </div>
          </TouchFeedback>
        </div>

        <div className="flex space-x-2">
          <TouchFeedback onClick={handleDownload}>
            <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <Download className="h-5 w-5 text-white" />
            </div>
          </TouchFeedback>
          {onShare && (
            <TouchFeedback onClick={onShare}>
              <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
                <Share2 className="h-5 w-5 text-white" />
              </div>
            </TouchFeedback>
          )}
          <TouchFeedback onClick={handlePrint}>
            <div className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600">
              <Printer className="h-5 w-5 text-white" />
            </div>
          </TouchFeedback>
        </div>
      </div>

      <div className="relative w-full aspect-video overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ 
            scale: zoom,
            rotate: rotation 
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {type === 'image' ? (
            <img
              src={url}
              alt="Document"
              className="max-w-full max-h-full object-contain"
            />
          ) : type === 'pdf' ? (
            <iframe
              src={url}
              className="w-full h-full"
              title="PDF Viewer"
            />
          ) : (
            <div className="flex items-center justify-center">
              <Eye className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-400">
                Aperçu non disponible
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
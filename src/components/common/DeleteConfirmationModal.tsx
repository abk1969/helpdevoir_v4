import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import TouchFeedback from './TouchFeedback';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemType: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemType
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{message}</p>
                </div>
                <TouchFeedback
                  onClick={onClose}
                  className="flex-shrink-0 ml-4"
                >
                  <div className="rounded-full p-1 hover:bg-gray-100">
                    <X className="h-5 w-5 text-gray-400" />
                  </div>
                </TouchFeedback>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <TouchFeedback onClick={onClose}>
                  <div className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Annuler
                  </div>
                </TouchFeedback>
                <TouchFeedback onClick={handleConfirm}>
                  <div className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                    Supprimer {itemType}
                  </div>
                </TouchFeedback>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
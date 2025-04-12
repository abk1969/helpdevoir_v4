import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Clock, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TouchFeedback from '../common/TouchFeedback';

interface QuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeLeft: string;
  isFreemium?: boolean;
}

export default function QuotaExceededModal({
  isOpen,
  onClose,
  timeLeft,
  isFreemium = true
}: QuotaExceededModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* En-tête */}
          <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <TouchFeedback 
              onClick={onClose}
              className="absolute top-4 right-4"
            >
              <div className="p-1 hover:bg-white/20 rounded-full">
                <X className="h-5 w-5" />
              </div>
            </TouchFeedback>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Limite atteinte</h3>
                <p className="text-white/80">
                  Temps restant : {timeLeft}
                </p>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Vous avez atteint votre limite d'utilisation de l'assistant IA.
              {isFreemium ? (
                ' Passez à un forfait supérieur pour bénéficier de plus de fonctionnalités.'
              ) : (
                ' Votre quota sera réinitialisé automatiquement.'
              )}
            </p>

            {isFreemium && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-amber-900 mb-2">
                  Avantages Premium
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-amber-800">
                    <Crown className="h-4 w-4 mr-2 text-amber-600" />
                    Plus de prompts et de tokens
                  </li>
                  <li className="flex items-center text-amber-800">
                    <Clock className="h-4 w-4 mr-2 text-amber-600" />
                    Temps d'attente réduit
                  </li>
                </ul>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <TouchFeedback onClick={onClose}>
                <div className="px-4 py-2 text-gray-600">
                  Fermer
                </div>
              </TouchFeedback>

              {isFreemium && (
                <TouchFeedback onClick={() => navigate('/subscription')}>
                  <div className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg">
                    <span>Voir les forfaits</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </TouchFeedback>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
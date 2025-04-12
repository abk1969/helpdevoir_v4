import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export default function FloatingActionButton({ 
  onClick, 
  icon = <Plus />, 
  label 
}: FloatingActionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-20 right-4 z-30 bg-indigo-600 text-white rounded-full shadow-lg touch-button"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="p-4 flex items-center">
        {icon}
        {label && <span className="ml-2">{label}</span>}
      </div>
    </motion.button>
  );
}
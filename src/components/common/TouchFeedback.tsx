import React from 'react';
import { motion } from 'framer-motion';

interface TouchFeedbackProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function TouchFeedback({ 
  children, 
  onClick, 
  className = '',
  disabled = false
}: TouchFeedbackProps) {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`touch-button ${className}`}
    >
      {children}
    </motion.div>
  );
}
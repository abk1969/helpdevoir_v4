import React from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import NavigationBar from '../layout/NavigationBar';
import { motion } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  onBack?: () => void;
  className?: string;
}

export default function PageContainer({
  children,
  title,
  showBack = true,
  showHome = true,
  onBack,
  className = ''
}: PageContainerProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {isMobile && (
          <NavigationBar
            title={title}
            showBack={showBack}
            showHome={showHome}
            onBack={onBack}
          />
        )}
        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`max-w-7xl mx-auto px-4 ${isMobile ? 'pt-20 pb-24' : 'py-8'} ${className}`}
          style={{ 
            paddingBottom: isMobile ? 'calc(5rem + env(safe-area-inset-bottom))' : '2rem'
          }}
        >
          {children}
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
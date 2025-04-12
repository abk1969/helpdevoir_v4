import React from 'react';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { Footer } from './Footer';
import { MobileNavigation } from './MobileNavigation';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CopyrightProvider from '../copyright/CopyrightProvider';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.2 }
  };

  return (
    <CopyrightProvider>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        
        <div className="flex-1 flex pt-16">
          {!isMobile && <Sidebar />}
          
          <main 
            className="flex-1 px-4 py-8 w-full"
            style={{ 
              paddingBottom: isMobile ? 'calc(5rem + env(safe-area-inset-bottom))' : '2rem',
              marginLeft: isMobile ? '0' : '80px', // Set to 80px since sidebar is collapsed by default
              transition: 'margin-left 0.2s ease-in-out'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-7xl mx-auto w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <Footer />
        {isMobile && <MobileNavigation />}

        <Toaster 
          position={isMobile ? "bottom-center" : "top-right"}
          toastOptions={{
            className: `${isMobile ? 'mb-20' : ''}`,
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              maxWidth: isMobile ? '90vw' : '350px',
            },
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            }
          }}
        />
      </div>
    </CopyrightProvider>
  );
}
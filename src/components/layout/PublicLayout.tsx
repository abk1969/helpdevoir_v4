import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import CopyrightProvider from '../copyright/CopyrightProvider';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <CopyrightProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <PublicHeader />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </CopyrightProvider>
  );
}
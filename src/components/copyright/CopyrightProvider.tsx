import React, { useEffect } from 'react';
import { protectContent, addVisibleWatermark, generateWatermark } from '../../utils/copyright';

interface CopyrightProviderProps {
  children: React.ReactNode;
}

export default function CopyrightProvider({ children }: CopyrightProviderProps) {
  useEffect(() => {
    // Initialise la protection du contenu
    protectContent();

    // Ajoute le filigrane
    const watermark = generateWatermark();
    addVisibleWatermark();

    // Ajoute des métadonnées de copyright
    const meta = document.createElement('meta');
    meta.name = 'copyright';
    meta.content = watermark;
    document.head.appendChild(meta);

    // Nettoyage lors du démontage du composant
    return () => {
      const watermarks = document.querySelectorAll('.watermark');
      watermarks.forEach(watermark => watermark.remove());
    };
  }, []);

  return (
    <div className="protected-content">
      {children}
    </div>
  );
}
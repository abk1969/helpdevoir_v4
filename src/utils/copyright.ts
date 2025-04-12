import { v4 as uuidv4 } from 'uuid';

// Génère un filigrane unique pour chaque session
export const generateWatermark = () => {
  const timestamp = new Date().toISOString();
  const sessionId = uuidv4();
  return `© ${new Date().getFullYear()} Help Devoir - Tous droits réservés`;
};

// Ajoute un filigrane invisible au contenu
export const addInvisibleWatermark = (content: string, watermark: string) => {
  const encodedWatermark = btoa(watermark);
  return `<!-- ${encodedWatermark} -->${content}`;
};

// Protège le contenu contre la copie
export const protectContent = () => {
  // Désactive la sélection de texte
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';

  // Désactive le clic droit
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Désactive les raccourcis clavier de copie
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
      e.preventDefault();
    }
  });
};

// Ajoute un filigrane visible
export const addVisibleWatermark = () => {
  // Supprime les filigranes existants
  const existingWatermarks = document.querySelectorAll('.watermark');
  existingWatermarks.forEach(watermark => watermark.remove());

  // Ajoute un nouveau filigrane
  const watermarkDiv = document.createElement('div');
  watermarkDiv.className = 'watermark';
  watermarkDiv.innerHTML = `contact@helpdevoir.globacom3000.com - Document protégé`;
  document.body.appendChild(watermarkDiv);
};
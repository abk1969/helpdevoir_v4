import { 
  Book, 
  Calculator, 
  Microscope, 
  Languages, 
  Music, 
  Palette, 
  Globe, 
  TestTube, 
  Code,
  LucideIcon 
} from 'lucide-react';
import type { Subject, GradeLevel } from '../types';

export const iconMap: Record<string, LucideIcon> = {
  Book,
  Calculator,
  Microscope,
  Languages,
  Music,
  Palette,
  Globe,
  TestTube,
  Code
};

export const subjectsByGrade: Record<GradeLevel, Subject[]> = {
  "CP": [
    { 
      id: "fr-cp", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "CP",
      description: "Apprentissage de la lecture et de l'écriture"
    },
    { 
      id: "math-cp", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "CP",
      description: "Nombres et calculs de base"
    },
    { 
      id: "art-cp", 
      name: "Arts", 
      icon: Palette, 
      color: "bg-purple-600", 
      gradeLevel: "CP",
      description: "Expression artistique"
    }
  ],
  "CE1": [
    { 
      id: "fr-ce1", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "CE1",
      description: "Lecture et écriture avancées"
    },
    { 
      id: "math-ce1", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "CE1",
      description: "Opérations et géométrie"
    },
    { 
      id: "sciences-ce1", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "CE1",
      description: "Découverte du monde"
    }
  ],
  "CE2": [
    { 
      id: "fr-ce2", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "CE2",
      description: "Grammaire et conjugaison"
    },
    { 
      id: "math-ce2", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "CE2",
      description: "Calcul et problèmes"
    },
    { 
      id: "sciences-ce2", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "CE2",
      description: "Sciences expérimentales"
    }
  ],
  "CM1": [
    { 
      id: "fr-cm1", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "CM1",
      description: "Expression écrite et orale"
    },
    { 
      id: "math-cm1", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "CM1",
      description: "Géométrie et mesures"
    },
    { 
      id: "sciences-cm1", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "CM1",
      description: "Sciences et technologie"
    }
  ],
  "CM2": [
    { 
      id: "fr-cm2", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "CM2",
      description: "Littérature et rédaction"
    },
    { 
      id: "math-cm2", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "CM2",
      description: "Problèmes complexes"
    },
    { 
      id: "sciences-cm2", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "CM2",
      description: "Expérimentation"
    }
  ],
  "6ème": [
    { 
      id: "fr-6", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "6ème",
      description: "Littérature et expression"
    },
    { 
      id: "math-6", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "6ème",
      description: "Nombres et calculs"
    },
    { 
      id: "sciences-6", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "6ème",
      description: "SVT et Physique-Chimie"
    }
  ],
  "5ème": [
    { 
      id: "fr-5", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "5ème",
      description: "Grammaire et expression"
    },
    { 
      id: "math-5", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "5ème",
      description: "Algèbre et géométrie"
    },
    { 
      id: "sciences-5", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "5ème",
      description: "Sciences expérimentales"
    }
  ],
  "4ème": [
    { 
      id: "fr-4", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "4ème",
      description: "Littérature et expression"
    },
    { 
      id: "math-4", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "4ème",
      description: "Algèbre et géométrie"
    },
    { 
      id: "sciences-4", 
      name: "Sciences", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "4ème",
      description: "Physique-Chimie et SVT"
    }
  ],
  "3ème": [
    { 
      id: "fr-3", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "3ème",
      description: "Préparation au brevet"
    },
    { 
      id: "math-3", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "3ème",
      description: "Algèbre et géométrie avancées"
    },
    { 
      id: "physics-3", 
      name: "Physique-Chimie", 
      icon: TestTube, 
      color: "bg-purple-600", 
      gradeLevel: "3ème",
      description: "Sciences expérimentales"
    },
    { 
      id: "svt-3", 
      name: "SVT", 
      icon: Microscope, 
      color: "bg-green-600", 
      gradeLevel: "3ème",
      description: "Sciences de la vie et de la Terre"
    },
    { 
      id: "history-3", 
      name: "Histoire-Géographie", 
      icon: Globe, 
      color: "bg-yellow-600", 
      gradeLevel: "3ème",
      description: "Histoire et géographie"
    },
    { 
      id: "english-3", 
      name: "Anglais", 
      icon: Languages, 
      color: "bg-pink-600", 
      gradeLevel: "3ème",
      description: "Langue vivante 1"
    },
    { 
      id: "tech-3", 
      name: "Technologie", 
      icon: Code, 
      color: "bg-gray-600", 
      gradeLevel: "3ème",
      description: "Sciences et technologie"
    }
  ],
  "Seconde": [
    { 
      id: "fr-2", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "Seconde",
      description: "Littérature et expression"
    },
    { 
      id: "math-2", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "Seconde",
      description: "Fonctions et géométrie"
    },
    {
      id: "physics-2",
      name: "Physique-Chimie",
      icon: TestTube,
      color: "bg-purple-600",
      gradeLevel: "Seconde",
      description: "Sciences expérimentales"
    },
    {
      id: "svt-2",
      name: "SVT",
      icon: Microscope,
      color: "bg-green-600",
      gradeLevel: "Seconde",
      description: "Sciences de la vie et de la Terre"
    },
    {
      id: "history-2",
      name: "Histoire-Géographie",
      icon: Globe,
      color: "bg-yellow-600",
      gradeLevel: "Seconde",
      description: "Histoire et géographie"
    }
  ],
  "Première": [
    { 
      id: "fr-1", 
      name: "Français", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "Première",
      description: "Préparation au bac"
    },
    { 
      id: "math-1", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "Première",
      description: "Spécialité maths"
    },
    {
      id: "physics-1",
      name: "Physique-Chimie",
      icon: TestTube,
      color: "bg-purple-600",
      gradeLevel: "Première",
      description: "Spécialité physique-chimie"
    },
    {
      id: "svt-1",
      name: "SVT",
      icon: Microscope,
      color: "bg-green-600",
      gradeLevel: "Première",
      description: "Spécialité SVT"
    },
    {
      id: "history-1",
      name: "Histoire-Géographie",
      icon: Globe,
      color: "bg-yellow-600",
      gradeLevel: "Première",
      description: "Tronc commun"
    },
    {
      id: "english-1",
      name: "Anglais",
      icon: Languages,
      color: "bg-pink-600",
      gradeLevel: "Première",
      description: "Langue vivante 1"
    }
  ],
  "Terminale": [
    { 
      id: "philo-t", 
      name: "Philosophie", 
      icon: Book, 
      color: "bg-blue-600", 
      gradeLevel: "Terminale",
      description: "Préparation au bac"
    },
    { 
      id: "math-t", 
      name: "Mathématiques", 
      icon: Calculator, 
      color: "bg-red-600", 
      gradeLevel: "Terminale",
      description: "Spécialité maths"
    },
    {
      id: "physics-t",
      name: "Physique-Chimie",
      icon: TestTube,
      color: "bg-purple-600",
      gradeLevel: "Terminale",
      description: "Spécialité physique-chimie"
    },
    {
      id: "svt-t",
      name: "SVT",
      icon: Microscope,
      color: "bg-green-600",
      gradeLevel: "Terminale",
      description: "Spécialité SVT"
    },
    {
      id: "history-t",
      name: "Histoire-Géographie",
      icon: Globe,
      color: "bg-yellow-600",
      gradeLevel: "Terminale",
      description: "Tronc commun"
    }
  ]
};
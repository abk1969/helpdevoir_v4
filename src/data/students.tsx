import { Book, Brain, Calculator, GraduationCap, Microscope, Music, Palette } from 'lucide-react';
import { Student } from '../types';

export const studentData: Record<string, Student> = {
  fares: {
    name: "Fares",
    grade: "CE2",
    subjects: [
      { name: "Français", icon: Book, color: "bg-blue-600" },
      { name: "Maths", icon: Calculator, color: "bg-red-600" },
      { name: "Découverte", icon: Brain, color: "bg-green-600" },
      { name: "Arts", icon: Palette, color: "bg-purple-600" },
    ]
  },
  safaa: {
    name: "Safaa",
    grade: "CM2",
    subjects: [
      { name: "Français", icon: Book, color: "bg-blue-600" },
      { name: "Maths", icon: Calculator, color: "bg-red-600" },
      { name: "Sciences", icon: Microscope, color: "bg-green-600" },
      { name: "Anglais", icon: GraduationCap, color: "bg-yellow-600" },
    ]
  },
  asma: {
    name: "Asma",
    grade: "5ème",
    subjects: [
      { name: "Français", icon: Book, color: "bg-blue-600" },
      { name: "Maths", icon: Calculator, color: "bg-red-600" },
      { name: "Sciences", icon: Microscope, color: "bg-green-600" },
      { name: "Musique", icon: Music, color: "bg-pink-600" },
    ]
  }
};
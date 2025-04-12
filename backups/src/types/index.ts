import { LucideIcon } from 'lucide-react';

export interface Student {
  id: string;
  firstName: string;
  age: number;
  email?: string;
  gradeLevel: GradeLevel;
  subjects: Subject[];
  hasDyslexia?: boolean;
  hearingImpaired?: boolean;
  visuallyImpaired?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  gradeLevel: GradeLevel;
  description?: string;
  isActive?: boolean;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  studentId: string;
  subjectId: string;
  estimatedTime?: string;
  createdAt: string;
  attachments?: HomeworkAttachment[];
  visualInstructions?: VisualInstruction[];
  signLanguageVideo?: string;
  visualSteps?: VisualStep[];
  dyslexiaSettings?: DyslexiaSettings;
  hearingImpairedSettings?: HearingImpairedSettings;
  visualImpairedSettings?: VisualImpairedSettings;
}

export interface HomeworkAttachment {
  id: string;
  type: 'file' | 'photo';
  url: string;
  name: string;
  fileType: string;
  size: number;
}

export interface VisualInstruction {
  type: 'image' | 'video' | 'signLanguage';
  url: string;
  description: string;
}

export interface VisualStep {
  title: string;
  content: string;
  image?: string;
}

export interface DyslexiaSettings {
  fontSize: number;
  colorScheme: string;
  lineSpacing: number;
}

export interface HearingImpairedSettings {
  hasSignLanguage: boolean;
  hasVisualInstructions: boolean;
  hasVisualSteps: boolean;
}

export interface VisualImpairedSettings {
  fontSize: number;
  contrast: number;
  isDarkMode: boolean;
  hasAudioDescription: boolean;
}

export type GradeLevel = 
  | "CP" | "CE1" | "CE2" | "CM1" | "CM2"
  | "6ème" | "5ème" | "4ème" | "3ème"
  | "Seconde" | "Première" | "Terminale";

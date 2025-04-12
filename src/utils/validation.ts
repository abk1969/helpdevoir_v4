import { z } from 'zod';
import { GradeLevel } from '../types';

// Validation pour l'authentification
export const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export const registerSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Vous devez accepter les conditions d\'utilisation',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Validation pour les étudiants
export const studentSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  age: z.number().int().min(6, 'L\'âge minimum est de 6 ans').max(18, 'L\'âge maximum est de 18 ans'),
  email: z.string().email('Adresse email invalide').optional().or(z.literal('')),
  gradeLevel: z.enum([
    'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    'Seconde', 'Première', 'Terminale'
  ] as [GradeLevel, ...GradeLevel[]], {
    errorMap: () => ({ message: 'Niveau scolaire invalide' }),
  }),
  hasDyslexia: z.boolean().optional(),
  hearingImpaired: z.boolean().optional(),
  visuallyImpaired: z.boolean().optional(),
});

// Validation pour les devoirs
export const homeworkSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  dueDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Date d\'échéance invalide',
  }),
  studentId: z.string().uuid('ID étudiant invalide'),
  subjectId: z.string().uuid('ID matière invalide'),
  estimatedTime: z.string().optional(),
});

// Validation pour les matières
export const subjectSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Couleur invalide'),
  gradeLevel: z.enum([
    'CP', 'CE1', 'CE2', 'CM1', 'CM2',
    '6ème', '5ème', '4ème', '3ème',
    'Seconde', 'Première', 'Terminale'
  ] as [GradeLevel, ...GradeLevel[]], {
    errorMap: () => ({ message: 'Niveau scolaire invalide' }),
  }),
  description: z.string().optional(),
});

// Validation pour les paramètres d'accessibilité
export const accessibilitySchema = z.object({
  fontSize: z.number().min(12, 'Taille de police minimale: 12').max(24, 'Taille de police maximale: 24'),
  lineSpacing: z.number().min(1, 'Espacement minimal: 1').max(3, 'Espacement maximal: 3'),
  colorScheme: z.enum(['default', 'dyslexia', 'highContrast', 'darkMode']),
  useDyslexiaFont: z.boolean(),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
});

// Types inférés à partir des schémas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
export type HomeworkFormData = z.infer<typeof homeworkSchema>;
export type SubjectFormData = z.infer<typeof subjectSchema>;
export type AccessibilityFormData = z.infer<typeof accessibilitySchema>;

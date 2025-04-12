import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subject, GradeLevel } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { subjectsByGrade } from '../data/subjects';
import toast from 'react-hot-toast';

interface SubjectState {
  subjects: Subject[];
  addSubject: (subjectData: Omit<Subject, 'id'>) => Promise<Subject>;
  getSubjectsForGrade: (grade: GradeLevel) => Subject[];
  getSubjectById: (id: string) => Subject | undefined;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => Promise<void>;
}

export const useSubjectStore = create<SubjectState>()(
  persist(
    (set, get) => ({
      subjects: [],
      
      addSubject: async (subjectData) => {
        try {
          if (!subjectData.name?.trim()) {
            throw new Error('Le nom de la matière est requis');
          }

          if (!subjectData.gradeLevel) {
            throw new Error('Le niveau scolaire est requis');
          }

          const newSubject: Subject = {
            id: uuidv4(),
            ...subjectData,
            isActive: true
          };

          set((state) => ({
            subjects: [...state.subjects, newSubject]
          }));

          toast.success('Matière ajoutée avec succès');
          return newSubject;
        } catch (error) {
          console.error('Erreur lors de l\'ajout de la matière:', error);
          throw error;
        }
      },

      getSubjectsForGrade: (grade) => {
        const defaultSubjects = subjectsByGrade[grade] || [];
        const customSubjects = get().subjects.filter(s => s.gradeLevel === grade);
        return [...defaultSubjects, ...customSubjects];
      },

      getSubjectById: (id) => {
        const allSubjects = [
          ...Object.values(subjectsByGrade).flat(),
          ...get().subjects
        ];
        return allSubjects.find(subject => subject.id === id);
      },

      updateSubject: (id, updates) => {
        set((state) => ({
          subjects: state.subjects.map(subject =>
            subject.id === id ? { ...subject, ...updates } : subject
          )
        }));
        toast.success('Matière mise à jour avec succès');
      },

      deleteSubject: async (id) => {
        set((state) => ({
          subjects: state.subjects.filter(subject => subject.id !== id)
        }));
        toast.success('Matière supprimée avec succès');
      }
    }),
    {
      name: 'subject-storage',
      version: 1
    }
  )
);
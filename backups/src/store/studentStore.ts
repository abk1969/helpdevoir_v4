import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, GradeLevel, Subject } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { subjectsByGrade } from '../data/subjects';
import toast from 'react-hot-toast';

interface StudentState {
  students: Student[];
  addStudent: (studentData: Omit<Student, 'id' | 'subjects'>) => Promise<Student>;
  getStudents: () => Student[];
  getStudentById: (id: string) => Student | undefined;
  updateStudent: (id: string, data: Partial<Student>) => void;
  deleteStudent: (id: string) => Promise<void>;
  getStudentsByGrade: (gradeLevel: string) => Student[];
  getStudentCount: () => number;
  initializeSubjects: (studentId: string, gradeLevel: GradeLevel) => void;
  updateStudentSubjects: (studentId: string, subjects: Subject[]) => void;
  toggleSubjectActive: (studentId: string, subjectId: string) => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: [],
      
      addStudent: async (studentData) => {
        try {
          // Validation des données
          if (!studentData.firstName?.trim()) {
            throw new Error('Le prénom est requis');
          }

          if (!studentData.gradeLevel) {
            throw new Error('Le niveau scolaire est requis');
          }

          // Création de l'étudiant avec les matières initialisées
          const gradeSubjects = subjectsByGrade[studentData.gradeLevel as GradeLevel] || [];
          const initializedSubjects = gradeSubjects.map(subject => ({
            ...subject,
            isActive: true
          }));

          const newStudent: Student = {
            id: uuidv4(),
            ...studentData,
            subjects: initializedSubjects
          };

          set((state) => ({
            students: [...state.students, newStudent]
          }));

          toast.success(`${studentData.firstName} a été ajouté(e) avec succès !`);
          return newStudent;

        } catch (error) {
          console.error('Erreur lors de l\'ajout:', error);
          toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'ajout');
          throw error;
        }
      },

      initializeSubjects: (studentId: string, gradeLevel: GradeLevel) => {
        try {
          const student = get().getStudentById(studentId);
          if (!student) {
            throw new Error('Étudiant non trouvé');
          }

          const gradeSubjects = subjectsByGrade[gradeLevel];
          if (!gradeSubjects || gradeSubjects.length === 0) {
            throw new Error(`Aucune matière trouvée pour le niveau ${gradeLevel}`);
          }

          const initializedSubjects = gradeSubjects.map(subject => ({
            ...subject,
            isActive: true
          }));

          set((state) => ({
            students: state.students.map(s => 
              s.id === studentId 
                ? { ...s, subjects: initializedSubjects }
                : s
            )
          }));

          toast.success('Matières initialisées avec succès');
        } catch (error) {
          console.error('Erreur lors de l\'initialisation des matières:', error);
          toast.error('Erreur lors de l\'initialisation des matières');
          throw error;
        }
      },

      getStudents: () => get().students,

      getStudentById: (id) => get().students.find(s => s.id === id),

      updateStudent: (id, data) => {
        const student = get().getStudentById(id);
        if (!student) {
          toast.error('Étudiant non trouvé');
          return;
        }

        // Si le niveau change, réinitialiser les matières
        if (data.gradeLevel && data.gradeLevel !== student.gradeLevel) {
          const gradeSubjects = subjectsByGrade[data.gradeLevel as GradeLevel] || [];
          const initializedSubjects = gradeSubjects.map(subject => ({
            ...subject,
            isActive: true
          }));
          data.subjects = initializedSubjects;
        }

        set((state) => ({
          students: state.students.map(s =>
            s.id === id ? { ...s, ...data } : s
          )
        }));

        toast.success('Étudiant mis à jour avec succès');
      },

      deleteStudent: async (id) => {
        try {
          const student = get().getStudentById(id);
          if (!student) {
            throw new Error('Étudiant non trouvé');
          }

          set((state) => ({
            students: state.students.filter(s => s.id !== id)
          }));

          toast.success(`${student.firstName} a été supprimé(e) avec succès`);
        } catch (error) {
          console.error('Erreur lors de la suppression:', error);
          toast.error('Erreur lors de la suppression');
          throw error;
        }
      },

      getStudentsByGrade: (gradeLevel) => {
        return get().students.filter(s => s.gradeLevel === gradeLevel);
      },

      getStudentCount: () => get().students.length,

      updateStudentSubjects: (studentId, subjects) => {
        set((state) => ({
          students: state.students.map(s =>
            s.id === studentId ? { ...s, subjects } : s
          )
        }));
        toast.success('Matières mises à jour avec succès');
      },

      toggleSubjectActive: (studentId, subjectId) => {
        set((state) => ({
          students: state.students.map(s => {
            if (s.id === studentId) {
              return {
                ...s,
                subjects: s.subjects.map(subject =>
                  subject.id === subjectId
                    ? { ...subject, isActive: !subject.isActive }
                    : subject
                )
              };
            }
            return s;
          })
        }));
        toast.success('Statut de la matière mis à jour');
      }
    }),
    {
      name: 'student-storage',
      version: 1,
    }
  )
);

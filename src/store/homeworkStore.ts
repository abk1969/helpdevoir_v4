import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Homework, HomeworkAttachment } from '../types';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

interface HomeworkState {
  homeworks: Homework[];
  addHomework: (homework: Omit<Homework, 'id' | 'completed' | 'createdAt' | 'attachments'>) => Promise<Homework>;
  toggleHomework: (id: string) => void;
  getHomeworksBySubject: (studentId: string, subjectId: string) => Homework[];
  addAttachment: (homeworkId: string, attachment: HomeworkAttachment) => void;
  removeAttachment: (homeworkId: string, attachmentId: string) => void;
  getHomeworkById: (id: string) => Homework | undefined;
  deleteHomework: (id: string) => void;
  updateHomework: (id: string, data: Partial<Homework>) => void;
  getUpcomingHomeworks: (studentId: string) => Homework[];
  getOverdueHomeworks: (studentId: string) => Homework[];
}

export const useHomeworkStore = create<HomeworkState>()(
  persist(
    (set, get) => ({
      homeworks: [],
      
      addHomework: async (homeworkData) => {
        try {
          if (!homeworkData.title?.trim()) {
            throw new Error('Le titre est requis');
          }

          if (!homeworkData.dueDate) {
            throw new Error('La date limite est requise');
          }

          const newHomework: Homework = {
            id: uuidv4(),
            ...homeworkData,
            completed: false,
            attachments: [],
            createdAt: new Date().toISOString()
          };

          set((state) => ({
            homeworks: [...state.homeworks, newHomework]
          }));

          toast.success('Devoir ajouté avec succès');
          return newHomework;
        } catch (error) {
          console.error('Erreur lors de l\'ajout du devoir:', error);
          toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'ajout');
          throw error;
        }
      },

      toggleHomework: (id) => {
        set((state) => ({
          homeworks: state.homeworks.map((hw) =>
            hw.id === id ? { ...hw, completed: !hw.completed } : hw
          )
        }));
      },

      getHomeworksBySubject: (studentId, subjectId) => {
        return get().homeworks.filter(
          (hw) => hw.studentId === studentId && hw.subjectId === subjectId
        );
      },

      getHomeworkById: (id) => {
        return get().homeworks.find(hw => hw.id === id);
      },

      addAttachment: (homeworkId, attachment) => {
        set((state) => ({
          homeworks: state.homeworks.map((hw) =>
            hw.id === homeworkId
              ? { ...hw, attachments: [...(hw.attachments || []), attachment] }
              : hw
          )
        }));
      },

      removeAttachment: (homeworkId, attachmentId) => {
        set((state) => ({
          homeworks: state.homeworks.map((hw) =>
            hw.id === homeworkId
              ? { ...hw, attachments: hw.attachments?.filter(a => a.id !== attachmentId) || [] }
              : hw
          )
        }));
      },

      deleteHomework: (id) => {
        set((state) => ({
          homeworks: state.homeworks.filter(hw => hw.id !== id)
        }));
        toast.success('Devoir supprimé');
      },

      updateHomework: (id, data) => {
        set((state) => ({
          homeworks: state.homeworks.map(hw =>
            hw.id === id ? { ...hw, ...data } : hw
          )
        }));
        toast.success('Devoir mis à jour');
      },

      getUpcomingHomeworks: (studentId) => {
        const now = new Date();
        return get().homeworks
          .filter(hw => 
            hw.studentId === studentId && 
            !hw.completed && 
            new Date(hw.dueDate) > now
          )
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      },

      getOverdueHomeworks: (studentId) => {
        const now = new Date();
        return get().homeworks
          .filter(hw => 
            hw.studentId === studentId && 
            !hw.completed && 
            new Date(hw.dueDate) < now
          )
          .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
      }
    }),
    {
      name: 'homework-storage',
      version: 1
    }
  )
);
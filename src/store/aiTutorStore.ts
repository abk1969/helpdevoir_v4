import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Solution {
  id: string;
  homeworkId: string;
  content: string;
  steps: string[];
  resources: string[];
  adaptedContent?: {
    dyslexia?: string;
    visual?: string;
    hearing?: string;
  };
}

interface AITutorState {
  solutions: Solution[];
  addSolution: (solution: Solution) => void;
  getSolutionForHomework: (homeworkId: string) => Solution | undefined;
  generateSolution: (homeworkId: string, content: string, studentNeeds: {
    hasDyslexia?: boolean;
    visuallyImpaired?: boolean;
    hearingImpaired?: boolean;
  }) => Promise<void>;
}

export const useAITutorStore = create<AITutorState>()(
  persist(
    (set, get) => ({
      solutions: [],

      addSolution: (solution) => {
        set((state) => ({
          solutions: [...state.solutions, solution]
        }));
      },

      getSolutionForHomework: (homeworkId) => {
        return get().solutions.find(s => s.homeworkId === homeworkId);
      },

      generateSolution: async (homeworkId, content, studentNeeds) => {
        try {
          // Simulation de l'appel à AWS Bedrock
          const solution: Solution = {
            id: Date.now().toString(),
            homeworkId,
            content: "Solution générée par l'IA...",
            steps: [
              "Étape 1: Analyse du problème",
              "Étape 2: Application de la méthode",
              "Étape 3: Vérification du résultat"
            ],
            resources: [
              "https://example.com/resource1",
              "https://example.com/resource2"
            ],
            adaptedContent: {
              ...(studentNeeds.hasDyslexia && {
                dyslexia: "Version adaptée pour la dyslexie..."
              }),
              ...(studentNeeds.visuallyImpaired && {
                visual: "Version adaptée pour les malvoyants..."
              }),
              ...(studentNeeds.hearingImpaired && {
                hearing: "Version adaptée avec support visuel..."
              })
            }
          };

          get().addSolution(solution);
        } catch (error) {
          console.error('Erreur lors de la génération de la solution:', error);
          throw error;
        }
      }
    }),
    {
      name: 'ai-tutor-storage',
      version: 1
    }
  )
);
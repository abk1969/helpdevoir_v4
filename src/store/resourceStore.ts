import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'audio' | 'interactive';
  url: string;
  tags: string[];
  accessibility: {
    hasDyslexiaSupport?: boolean;
    hasVisualSupport?: boolean;
    hasHearingSupport?: boolean;
  };
  metadata: {
    duration?: string;
    difficulty: 'easy' | 'medium' | 'hard';
    subject: string;
    gradeLevel: string;
  };
}

interface ResourceState {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id'>) => void;
  getResourcesBySubject: (subject: string) => Resource[];
  getResourcesByAccessibility: (needs: {
    hasDyslexia?: boolean;
    visuallyImpaired?: boolean;
    hearingImpaired?: boolean;
  }) => Resource[];
}

export const useResourceStore = create<ResourceState>()(
  persist(
    (set, get) => ({
      resources: [],

      addResource: (resourceData) => {
        const newResource: Resource = {
          id: Date.now().toString(),
          ...resourceData
        };

        set((state) => ({
          resources: [...state.resources, newResource]
        }));
      },

      getResourcesBySubject: (subject) => {
        return get().resources.filter(
          resource => resource.metadata.subject === subject
        );
      },

      getResourcesByAccessibility: (needs) => {
        return get().resources.filter(resource => {
          if (needs.hasDyslexia && resource.accessibility.hasDyslexiaSupport) return true;
          if (needs.visuallyImpaired && resource.accessibility.hasVisualSupport) return true;
          if (needs.hearingImpaired && resource.accessibility.hasHearingSupport) return true;
          return false;
        });
      }
    }),
    {
      name: 'resource-storage',
      version: 1
    }
  )
);
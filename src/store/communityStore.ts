import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

interface CommunityState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  likePost: (postId: string) => void;
  getPostsByTag: (tag: string) => Post[];
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: [],

      addPost: (postData) => {
        const newPost: Post = {
          id: Date.now().toString(),
          ...postData,
          likes: 0,
          comments: [],
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          posts: [newPost, ...state.posts]
        }));
      },

      addComment: (postId, commentData) => {
        const newComment: Comment = {
          id: Date.now().toString(),
          ...commentData,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        }));
      },

      likePost: (postId) => {
        set((state) => ({
          posts: state.posts.map(post =>
            post.id === postId
              ? { ...post, likes: post.likes + 1 }
              : post
          )
        }));
      },

      getPostsByTag: (tag) => {
        return get().posts.filter(post => post.tags.includes(tag));
      }
    }),
    {
      name: 'community-storage',
      version: 1
    }
  )
);
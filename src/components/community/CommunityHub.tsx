import React from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore } from '../../store/communityStore';
import { MessageSquare, Heart, Share2, Users } from 'lucide-react';

export default function CommunityHub() {
  const { posts, addPost, likePost, addComment } = useCommunityStore();

  return (
    <div className="space-y-6 px-4 md:px-0">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Communauté</h1>
        <p className="text-gray-600">Partagez et apprenez ensemble</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all touch-button"
        >
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Créer une discussion</h3>
              <p className="text-sm text-gray-500">Partagez votre expérience</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.content}</p>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => likePost(post.id)}
                className="flex items-center text-gray-500 hover:text-red-500 touch-button"
              >
                <Heart className="h-5 w-5 mr-1" />
                <span>{post.likes}</span>
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-indigo-500 touch-button">
                <MessageSquare className="h-5 w-5 mr-1" />
                <span>{post.comments.length}</span>
              </button>

              <button className="flex items-center text-gray-500 hover:text-indigo-500 touch-button">
                <Share2 className="h-5 w-5 mr-1" />
                <span>Partager</span>
              </button>
            </div>

            {post.comments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Commentaires récents</h4>
                <div className="space-y-3">
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="text-sm text-gray-600">
                      {comment.content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
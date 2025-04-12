import React, { useState } from 'react';
import { useAIQuota } from '../../hooks/useAIQuota';
import AIQuotaProvider from '../ai/AIQuotaProvider';
import AIModelSelector from '../ai/AIModelSelector';
import AIFeedbackButtons from '../ai/AIFeedbackButtons';
import { Brain, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface AIHomeworkHelperProps {
  homeworkId: string;
}

export default function AIHomeworkHelper({ homeworkId }: AIHomeworkHelperProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedModel, setSelectedModel] = useState('claude-3-sonnet');
  
  const { checkQuota } = useAIQuota();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Vérifier le quota avant de procéder
    if (!checkQuota(100)) return; // Estimation de 100 tokens pour la requête

    setIsLoading(true);
    setError(null);

    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResponse("Voici une réponse d'exemple générée par l'IA...");
    } catch (err) {
      setError(err as Error);
      toast.error("Une erreur est survenue lors de la génération de la réponse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIQuotaProvider
      isLoading={isLoading}
      error={error}
      onRetry={() => handleSubmit}
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Brain className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-bold">Assistant IA</h2>
        </div>

        <AIModelSelector
          selectedModel={selectedModel}
          onModelSelect={setSelectedModel}
        />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pose ta question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Comment résoudre ce problème ?"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5 mr-2" />
            Envoyer
          </button>
        </form>

        {response && (
          <div className="mt-6">
            <div className="prose max-w-none">
              <p>{response}</p>
            </div>
            <AIFeedbackButtons />
          </div>
        )}
      </div>
    </AIQuotaProvider>
  );
}
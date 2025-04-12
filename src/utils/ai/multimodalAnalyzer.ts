import { OpenAI } from 'openai';
import { Anthropic } from 'anthropic';
import { MistralClient } from 'mistralai';
import { openaiConfig, anthropicClient, mistralClient } from './aiConfig';

const openai = new OpenAI(openaiConfig);

export interface MultimodalAnalysisResult {
  text: string;
  confidence: number;
  metadata: {
    model: string;
    processingTime: number;
    tokens: number;
  };
  visualElements?: {
    type: 'image' | 'diagram' | 'table' | 'graph';
    description: string;
    confidence: number;
  }[];
}

export class MultimodalAnalyzer {
  private static instance: MultimodalAnalyzer;

  private constructor() {}

  static getInstance(): MultimodalAnalyzer {
    if (!MultimodalAnalyzer.instance) {
      MultimodalAnalyzer.instance = new MultimodalAnalyzer();
    }
    return MultimodalAnalyzer.instance;
  }

  async analyzeDocument(file: File): Promise<MultimodalAnalysisResult> {
    const startTime = Date.now();
    try {
      const base64Data = await this.fileToBase64(file);

      // Analyse parallèle avec GPT-4V et Claude 3
      const [gptAnalysis, claudeAnalysis] = await Promise.all([
        this.analyzeWithGPT4V(base64Data),
        this.analyzeWithClaude3(base64Data)
      ]);

      // Combiner les résultats
      const combinedResult = this.combineResults(gptAnalysis, claudeAnalysis);

      return {
        ...combinedResult,
        metadata: {
          model: 'multimodal-ensemble',
          processingTime: Date.now() - startTime,
          tokens: gptAnalysis.metadata.tokens + claudeAnalysis.metadata.tokens
        }
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse multimodale:', error);
      throw error;
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private async analyzeWithGPT4V(base64Image: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Analyse ce document de devoir et fournis une description détaillée avec les éléments visuels importants."
            },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high"
              }
            }
          ],
        },
      ],
      max_tokens: 4096,
    });

    return {
      text: response.choices[0].message.content || '',
      metadata: {
        tokens: response.usage?.total_tokens || 0,
        model: 'gpt-4-vision'
      }
    };
  }

  private async analyzeWithClaude3(base64Image: string) {
    const response = await anthropicClient.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyse ce document de devoir et fournis une description détaillée avec les éléments visuels importants."
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Image.split(',')[1]
            }
          }
        ]
      }]
    });

    return {
      text: response.content[0].text,
      metadata: {
        tokens: response.usage?.input_tokens || 0,
        model: 'claude-3-opus'
      }
    };
  }

  private combineResults(gptResult: any, claudeResult: any): MultimodalAnalysisResult {
    // Calculer la confiance basée sur la cohérence des résultats
    const confidence = this.calculateConfidence(gptResult.text, claudeResult.text);

    // Extraire les éléments visuels
    const visualElements = this.extractVisualElements(gptResult.text, claudeResult.text);

    return {
      text: this.mergeAnalyses(gptResult.text, claudeResult.text),
      confidence,
      metadata: {
        model: 'multimodal-ensemble',
        processingTime: 0,
        tokens: gptResult.metadata.tokens + claudeResult.metadata.tokens
      },
      visualElements
    };
  }

  private calculateConfidence(text1: string, text2: string): number {
    // Implémentation simple de la similarité cosinus
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    return intersection.size / Math.sqrt(words1.size * words2.size);
  }

  private extractVisualElements(text1: string, text2: string): MultimodalAnalysisResult['visualElements'] {
    // Analyse des éléments visuels mentionnés dans les deux textes
    const elements: MultimodalAnalysisResult['visualElements'] = [];
    
    const visualTypes = ['image', 'diagram', 'table', 'graph'] as const;
    visualTypes.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'gi');
      if (regex.test(text1) || regex.test(text2)) {
        elements.push({
          type,
          description: this.extractDescription(text1, text2, type),
          confidence: 0.9
        });
      }
    });

    return elements;
  }

  private extractDescription(text1: string, text2: string, type: string): string {
    // Extraire la description pertinente autour du type d'élément visuel
    const sentences = [...text1.split('.'), ...text2.split('.')];
    const relevantSentences = sentences.filter(s => 
      s.toLowerCase().includes(type.toLowerCase())
    );
    return relevantSentences[0]?.trim() || `${type} détecté`;
  }

  private mergeAnalyses(text1: string, text2: string): string {
    // Fusionner les analyses en évitant les redondances
    const sentences1 = new Set(text1.split('.').map(s => s.trim()));
    const sentences2 = new Set(text2.split('.').map(s => s.trim()));
    
    const uniqueSentences = new Set([...sentences1, ...sentences2]);
    return Array.from(uniqueSentences).join('. ');
  }
}

export const multimodalAnalyzer = MultimodalAnalyzer.getInstance();
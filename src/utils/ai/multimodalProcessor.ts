import { OpenAI } from 'openai';
import { Anthropic } from 'anthropic';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { openaiConfig, anthropicClient, bedrockClient } from './aiConfig';
import { errorHandler } from '../errorHandler';

const openai = new OpenAI(openaiConfig);

export interface DocumentAnalysisResult {
  text: string;
  confidence: number;
  metadata: {
    pageCount?: number;
    format: string;
    language?: string;
    processingTime: number;
  };
}

export class MultimodalProcessor {
  private static instance: MultimodalProcessor;

  private constructor() {}

  static getInstance(): MultimodalProcessor {
    if (!MultimodalProcessor.instance) {
      MultimodalProcessor.instance = new MultimodalProcessor();
    }
    return MultimodalProcessor.instance;
  }

  async analyzeDocument(file: File): Promise<DocumentAnalysisResult> {
    const startTime = Date.now();
    try {
      const format = this.getFileFormat(file);
      let text = '';
      let confidence = 0;

      switch (format) {
        case 'image':
          const imageAnalysis = await this.processImage(file);
          text = imageAnalysis.text;
          confidence = imageAnalysis.confidence;
          break;

        case 'pdf':
          const pdfAnalysis = await this.processPDF(file);
          text = pdfAnalysis.text;
          confidence = pdfAnalysis.confidence;
          break;

        case 'document':
          const docAnalysis = await this.processDocument(file);
          text = docAnalysis.text;
          confidence = docAnalysis.confidence;
          break;

        default:
          throw new Error('Format de fichier non supporté');
      }

      return {
        text,
        confidence,
        metadata: {
          format,
          processingTime: Date.now() - startTime
        }
      };
    } catch (error) {
      errorHandler.handleError(error as Error, 'Document analysis');
      throw error;
    }
  }

  private getFileFormat(file: File): string {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const documentTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (imageTypes.includes(file.type)) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (documentTypes.includes(file.type)) return 'document';
    
    throw new Error(`Type de fichier non supporté: ${file.type}`);
  }

  private async processImage(file: File): Promise<{ text: string; confidence: number }> {
    try {
      // Convertir l'image en base64
      const base64Image = await this.fileToBase64(file);

      // Analyse avec GPT-4 Vision
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse ce document et explique son contenu en détail:" },
              {
                type: "image_url",
                image_url: {
                  url: base64Image,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 4096
      });

      // Analyse parallèle avec Claude 3 Vision
      const claudeResponse = await anthropicClient.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyse ce document et explique son contenu en détail:"
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

      // Combiner et comparer les résultats
      const gptAnalysis = visionResponse.choices[0].message.content || '';
      const claudeAnalysis = claudeResponse.content[0].text;

      // Calculer la confiance basée sur la similarité des réponses
      const confidence = this.calculateConfidence(gptAnalysis, claudeAnalysis);

      // Fusionner les analyses
      const combinedAnalysis = this.combineAnalyses(gptAnalysis, claudeAnalysis);

      return {
        text: combinedAnalysis,
        confidence
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse de l'image: ${error}`);
    }
  }

  private async processPDF(file: File): Promise<{ text: string; confidence: number }> {
    try {
      // Convertir le PDF en images
      const images = await this.pdfToImages(file);
      
      // Analyser chaque page
      const pageAnalyses = await Promise.all(
        images.map(async (image) => {
          const analysis = await this.processImage(image);
          return analysis.text;
        })
      );

      // Combiner les résultats
      const combinedText = pageAnalyses.join('\n\n');
      
      return {
        text: combinedText,
        confidence: 0.95 // Ajuster en fonction de la qualité des résultats
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse du PDF: ${error}`);
    }
  }

  private async processDocument(file: File): Promise<{ text: string; confidence: number }> {
    try {
      // Extraire le texte du document
      const text = await this.extractTextFromDocument(file);

      // Analyser avec Claude 3
      const analysis = await anthropicClient.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4096,
        messages: [{
          role: "user",
          content: `Analyse ce document et explique son contenu en détail:\n\n${text}`
        }]
      });

      return {
        text: analysis.content[0].text,
        confidence: 0.9
      };
    } catch (error) {
      throw new Error(`Erreur lors de l'analyse du document: ${error}`);
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

  private async pdfToImages(file: File): Promise<File[]> {
    // Implémenter la conversion PDF vers images
    // Utiliser pdf.js ou une autre bibliothèque
    return [];
  }

  private async extractTextFromDocument(file: File): Promise<string> {
    // Implémenter l'extraction de texte pour les documents Word
    // Utiliser mammoth.js ou une autre bibliothèque
    return '';
  }

  private calculateConfidence(analysis1: string, analysis2: string): number {
    // Implémenter un algorithme de similarité pour comparer les analyses
    // Utiliser par exemple la distance de Levenshtein ou un autre algorithme
    return 0.9;
  }

  private combineAnalyses(analysis1: string, analysis2: string): string {
    // Implémenter la fusion intelligente des analyses
    // Utiliser NLP pour identifier les informations uniques et complémentaires
    return `${analysis1}\n\nAnalyse complémentaire:\n${analysis2}`;
  }
}

export const multimodalProcessor = MultimodalProcessor.getInstance();
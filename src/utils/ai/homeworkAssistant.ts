import { openaiConfig } from './aiConfig';
import { anthropicClient } from './aiConfig';
import { mistralClient } from './aiConfig';
import { bedrockClient } from './aiConfig';
import { replicateClient } from './aiConfig';
import { PISTRAL_MODELS } from './aiConfig';
import { OpenAI } from 'openai';
import { Homework } from '../../types';

const openai = new OpenAI(openaiConfig);

export class HomeworkAssistant {
  async getHomeworkHelp(homework: Homework, question: string, model: string = 'claude-3-sonnet') {
    try {
      switch (model) {
        case 'claude-3-sonnet':
          return await this.getClaudeResponse(homework, question);
        case 'gpt-4':
          return await this.getGPT4Response(homework, question);
        case 'mistral':
          return await this.getMistralResponse(homework, question);
        case 'pistral-12b':
        case 'pistral-12b-instruct':
          return await this.getPistralResponse(homework, question, model);
        case 'llama2':
          return await this.getLlama2Response(homework, question);
        default:
          throw new Error('Modèle non supporté');
      }
    } catch (error) {
      console.error('Erreur lors de la génération de l\'aide:', error);
      throw error;
    }
  }

  private async getClaudeResponse(homework: Homework, question: string) {
    const message = await anthropicClient.messages.create({
      model: 'claude-3-sonnet-20240229-v1:0',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Devoir: ${homework.title}\nDescription: ${homework.description}\nQuestion: ${question}`
      }]
    });
    return message.content;
  }

  private async getGPT4Response(homework: Homework, question: string) {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pédagogique bienveillant qui aide les élèves à comprendre leurs devoirs.'
        },
        {
          role: 'user',
          content: `Devoir: ${homework.title}\nDescription: ${homework.description}\nQuestion: ${question}`
        }
      ]
    });
    return completion.choices[0].message.content;
  }

  private async getMistralResponse(homework: Homework, question: string) {
    const response = await mistralClient.chat({
      model: 'mistral-large-latest',
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pédagogique qui aide les élèves à comprendre leurs devoirs.'
        },
        {
          role: 'user',
          content: `Devoir: ${homework.title}\nDescription: ${homework.description}\nQuestion: ${question}`
        }
      ]
    });
    return response.choices[0].message.content;
  }

  private async getPistralResponse(homework: Homework, question: string, modelType: 'pistral-12b' | 'pistral-12b-instruct') {
    const modelConfig = PISTRAL_MODELS[modelType];
    
    const response = await mistralClient.chat({
      model: modelConfig.id,
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant pédagogique spécialisé qui aide les élèves à comprendre leurs devoirs.'
        },
        {
          role: 'user',
          content: `Devoir: ${homework.title}\nDescription: ${homework.description}\nQuestion: ${question}`
        }
      ],
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      topP: modelConfig.topP
    });
    
    return response.choices[0].message.content;
  }

  private async getLlama2Response(homework: Homework, question: string) {
    const response = await replicateClient.run(
      "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
      {
        input: {
          prompt: `Devoir: ${homework.title}\nDescription: ${homework.description}\nQuestion: ${question}`,
          system_prompt: "Tu es un assistant pédagogique qui aide les élèves à comprendre leurs devoirs.",
          max_tokens: 4096
        }
      }
    );
    return response;
  }

  async getImageAnalysis(imageUrl: string) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyse cette image de devoir et explique-moi ce qu'il faut faire:" },
            {
              type: "image_url",
              image_url: imageUrl,
            },
          ],
        },
      ],
    });
    return response.choices[0].message.content;
  }
}
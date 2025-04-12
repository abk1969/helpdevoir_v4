import { Configuration } from 'openai';
import { Anthropic } from 'anthropic';
import { MistralClient } from 'mistralai';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';

// OpenAI Configuration
export const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Anthropic Configuration
export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// Mistral Configuration
export const mistralClient = new MistralClient({
  apiKey: process.env.MISTRAL_API_KEY || '',
});

// AWS Bedrock Configuration
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
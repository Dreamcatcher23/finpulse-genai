'use server';

import {
  chatWithFinancialAiAssistant,
  ChatWithFinancialAiAssistantInput,
} from '@/ai/flows/chat-with-financial-ai-assistant';
import {
  generateFinancialQuiz,
  GenerateFinancialQuizInput,
} from '@/ai/flows/generate-financial-quiz';
import {
  generatePersonalizedContentRecommendations,
  PersonalizedContentRecommendationsInput,
} from '@/ai/flows/generate-personalized-content-recommendations';
import {
  summarizeFinancialArticle,
  SummarizeFinancialArticleInput,
} from '@/ai/flows/summarize-financial-articles';
import { textToSpeech, TextToSpeechInput } from '@/ai/flows/enable-voice-interaction';
import { generateFinancialPlan, GenerateFinancialPlanInput } from '@/ai/flows/generate-financial-plan';
import pdf from 'pdf-parse';


export async function getAiChatResponse(
  input: ChatWithFinancialAiAssistantInput
) {
  const result = await chatWithFinancialAiAssistant(input);
  return result;
}

export async function getFinancialQuiz(input: GenerateFinancialQuizInput) {
  const result = await generateFinancialQuiz(input);
  return result;
}

export async function getArticleSummary(
  input: SummarizeFinancialArticleInput
) {
  const result = await summarizeFinancialArticle(input);
  return result;
}

export async function getPersonalizedRecommendations(
  input: PersonalizedContentRecommendationsInput
) {
  const result = await generatePersonalizedContentRecommendations(input);
  return result;
}

export async function getSpeechFromText(input: TextToSpeechInput) {
    const result = await textToSpeech(input);
    return result;
}

export async function getFinancialPlan(input: GenerateFinancialPlanInput) {
    const result = await generateFinancialPlan(input);
    return result;
}

export async function extractTextFromFile(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file uploaded.');
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension === 'txt') {
    return fileBuffer.toString('utf-8');
  }

  if (fileExtension === 'pdf') {
    const data = await pdf(fileBuffer);
    return data.text;
  }
  
  if (fileExtension === 'docx') {
    // DOCX parsing would require another library like 'mammoth'
    // For now, we return a placeholder.
    return 'DOCX parsing is not fully implemented in this prototype.';
  }

  throw new Error('Unsupported file type.');
}

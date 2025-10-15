
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

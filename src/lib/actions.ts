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

// Helper function to generate mock market data based on realistic 2025 values
const generateMockMarketData = () => {
  const formatNumber = (num: number) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  
  const createIndex = (name: string, base: number, variance: number) => {
    const value = base + (Math.random() - 0.5) * variance;
    const change = (Math.random() - 0.45) * 2;
    return {
      name,
      value: formatNumber(value),
      change: `(${formatChange(change)})`,
      isPositive: change >= 0,
    };
  };

  const createStock = (symbol: string, base: number, variance: number) => {
    const value = base + (Math.random() - 0.5) * variance;
    const change = (Math.random() - 0.5) * 4;
    return {
      symbol,
      price: `₹${formatNumber(value)}`,
      change: formatChange(change),
      isPositive: change >= 0,
    };
  };

  return {
    indices: [
      createIndex('SENSEX', 84778, 1200),
      createIndex('NIFTY 50', 25966, 400),
    ],
    trendingStocks: [
      createStock('RELIANCE', 3500, 70), // Placeholder adjusted value
      createStock('TCS', 4500, 90),      // Placeholder adjusted value
      createStock('HDFCBANK', 1000, 50),
    ],
    exchangeRate: (85.5 + (Math.random() - 0.5) * 5).toFixed(2),
    goldPrice: (12000 + Math.random() * 250).toFixed(2),
    silverPrice: (155 + Math.random() * 10).toFixed(2),
  };
};


export async function getMarketInsights() {
  // In a real application, you would fetch data from a financial API here.
  // For this prototype, we'll return mock data with a simulated delay.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockMarketData());
    }, 1000);
  });
}

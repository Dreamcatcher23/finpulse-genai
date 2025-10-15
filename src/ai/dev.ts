'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-financial-quiz.ts';
import '@/ai/flows/summarize-financial-articles.ts';
import '@/ai/flows/generate-personalized-content-recommendations.ts';
import '@/ai/flows/chat-with-financial-ai-assistant.ts';
import '@/ai/flows/enable-voice-interaction.ts';
import '@/ai/flows/generate-financial-plan.ts';

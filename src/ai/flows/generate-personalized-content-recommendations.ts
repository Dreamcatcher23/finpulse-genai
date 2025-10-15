'use server';
/**
 * @fileOverview Generates personalized content recommendations based on user's financial interests and goals.
 *
 * - generatePersonalizedContentRecommendations - A function that generates personalized content recommendations.
 * - PersonalizedContentRecommendationsInput - The input type for the generatePersonalizedContentRecommendations function.
 * - PersonalizedContentRecommendationsOutput - The return type for the generatePersonalizedContentRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedContentRecommendationsInputSchema = z.object({
  financialInterests: z
    .string()
    .describe('The financial interests of the user.'),
  financialGoals: z.string().describe('The financial goals of the user.'),
  riskTolerance: z.string().describe('The risk tolerance of the user.'),
});
export type PersonalizedContentRecommendationsInput = z.infer<
  typeof PersonalizedContentRecommendationsInputSchema
>;

const PersonalizedContentRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized content recommendations.'),
});
export type PersonalizedContentRecommendationsOutput = z.infer<
  typeof PersonalizedContentRecommendationsOutputSchema
>;

export async function generatePersonalizedContentRecommendations(
  input: PersonalizedContentRecommendationsInput
): Promise<PersonalizedContentRecommendationsOutput> {
  return generatePersonalizedContentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedContentRecommendationsPrompt',
  input: {schema: PersonalizedContentRecommendationsInputSchema},
  output: {schema: PersonalizedContentRecommendationsOutputSchema},
  prompt: `You are an AI assistant specializing in providing personalized financial content recommendations based on user preferences.\n\n  Given the user's financial interests, goals, and risk tolerance, generate a list of content recommendations that would be most relevant and helpful to them.\n\n  Financial Interests: {{{financialInterests}}}\n  Financial Goals: {{{financialGoals}}}\n  Risk Tolerance: {{{riskTolerance}}}\n\n  Recommendations should be specific and actionable, and cater to the user's unique financial profile.\n  Format the content recommendations as a list of strings.
  `,
});

const generatePersonalizedContentRecommendationsFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedContentRecommendationsFlow',
    inputSchema: PersonalizedContentRecommendationsInputSchema,
    outputSchema: PersonalizedContentRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

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
  articles: z
    .array(
      z.object({
        title: z.string().describe('The title of the recommended article.'),
        description: z
          .string()
          .describe('A one-sentence description of the article.'),
      })
    )
    .describe('A list of 5 recommended articles or topics to read.'),
  tools: z
    .array(
      z.object({
        name: z.string().describe("The name of the app feature/tool."),
        description: z
          .string()
          .describe('A one-sentence description of why the user should use it.'),
      })
    )
    .describe(
      "A list of 3 financial tools or features from within the app that the user should explore. Available features: 'Financial Planner', 'AI Financial Chat', 'Content Summarizer', 'Gamified Quizzes', 'Cost Management'."
    ),
  learningPaths: z
    .array(
      z.object({
        title: z.string().describe('The title of the learning path.'),
        suggestedTopics: z
          .array(z.string())
          .describe('A list of quiz topics for this learning path.'),
      })
    )
    .describe(
      'A list of 2 learning paths, like "Master Mutual Funds in 7 Days".'
    ),
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
  prompt: `You are an AI assistant specializing in providing personalized financial content recommendations.

Given the user's profile, generate a structured list of recommendations.

User Profile:
- Financial Interests: {{{financialInterests}}}
- Financial Goals: {{{financialGoals}}}
- Risk Tolerance: {{{riskTolerance}}}

Instructions:
1.  **Recommend 5 Articles/Topics**: Suggest relevant articles or topics for the user to read. Each should have a title and a one-sentence description.
2.  **Recommend 3 In-App Tools**: Suggest 3 features from the app that would be most helpful. Choose from: 'Financial Planner', 'AI Financial Chat', 'Content Summarizer', 'Gamified Quizzes', 'Cost Management'. Provide a one-sentence reason for each suggestion.
3.  **Create 2 Learning Paths**: Design two mini-learning paths, each with a catchy title (e.g., "Master Mutual Funds in 7 Days") and a list of suggested quiz topics to support that path.

Your output must be a valid JSON object that adheres to the provided output schema.
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

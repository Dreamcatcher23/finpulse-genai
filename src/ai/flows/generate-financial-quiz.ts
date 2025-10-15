
'use server';

/**
 * @fileOverview An AI agent to generate financial quizzes.
 *
 * - generateFinancialQuiz - A function that generates a financial quiz.
 * - GenerateFinancialQuizInput - The input type for the generateFinancialQuiz function.
 * - GenerateFinancialQuizOutput - The return type for the generateFinancialQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialQuizInputSchema = z.object({
  topic: z.string().describe('The topic of the financial quiz.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the quiz.'),
  numQuestions: z
    .number()
    .min(1)
    .max(10)
    .default(5)
    .describe('The number of questions in the quiz.'),
  userType: z
    .enum(['investor', 'student', 'SME', 'advisor'])
    .default('investor')
    .describe('The type of user taking the quiz (e.g., student, investor).'),
});
export type GenerateFinancialQuizInput = z.infer<typeof GenerateFinancialQuizInputSchema>;

const GenerateFinancialQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The question text.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswerIndex: z
        .number()
        .min(0)
        .describe('The index of the correct answer in the options array.'),
      explanation: z.string().describe('Explanation of the correct answer.'),
    })
  ).describe('The generated financial quiz.'),
});
export type GenerateFinancialQuizOutput = z.infer<typeof GenerateFinancialQuizOutputSchema>;

export async function generateFinancialQuiz(input: GenerateFinancialQuizInput): Promise<GenerateFinancialQuizOutput> {
  return generateFinancialQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialQuizPrompt',
  input: {schema: GenerateFinancialQuizInputSchema},
  output: {schema: GenerateFinancialQuizOutputSchema},
  prompt: `You are an expert in finance and are tasked with creating a financial quiz.

The quiz should be tailored for a {{{userType}}}.
The quiz should cover the topic: {{{topic}}}.
The difficulty level should be: {{{difficulty}}}.
The quiz should contain {{{numQuestions}}} questions.

Each question should have multiple choice options, with one correct answer.
Include an explanation for each correct answer.

Your output should be formatted as a JSON object with a "quiz" field, which is an array of question objects.
Each question object should have the following fields:
- "question": The question text.
- "options": An array of possible answer options.
- "correctAnswerIndex": The index of the correct answer in the options array.
- "explanation": Explanation of the correct answer.

Here's an example of the desired format:
{
  "quiz": [
    {
      "question": "What is the current ratio?",
      "options": ["Current Assets / Current Liabilities", "Total Assets / Total Liabilities", "Net Income / Sales"],
      "correctAnswerIndex": 0,
      "explanation": "The current ratio is a liquidity ratio that measures a company's ability to pay its short-term obligations."
    },
    {
      "question": "What is the price-to-earnings ratio?",
      "options": ["Share Price / Earnings Per Share", "Market Cap / Revenue", "Net Income / Number of Shares Outstanding"],
      "correctAnswerIndex": 0,
      "explanation": "The price-to-earnings ratio (P/E ratio) is a valuation ratio that compares a company's share price to its earnings per share."
    }
  ]
}

Now generate the quiz.
`,
});

const generateFinancialQuizFlow = ai.defineFlow(
  {
    name: 'generateFinancialQuizFlow',
    inputSchema: GenerateFinancialQuizInputSchema,
    outputSchema: GenerateFinancialQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

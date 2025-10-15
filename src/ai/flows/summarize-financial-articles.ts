'use server';

/**
 * @fileOverview A flow to summarize financial articles.
 *
 * - summarizeFinancialArticle - A function that handles the summarization of financial articles.
 * - SummarizeFinancialArticleInput - The input type for the summarizeFinancialArticle function.
 * - SummarizeFinancialArticleOutput - The return type for the summarizeFinancialArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeFinancialArticleInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the financial article to summarize.'),
  summaryStyle: z
    .enum(['brief', 'detailed', 'actionable'])
    .default('brief')
    .describe('The desired style of the summary.'),
});
export type SummarizeFinancialArticleInput = z.infer<
  typeof SummarizeFinancialArticleInputSchema
>;

const SummarizeFinancialArticleOutputSchema = z.object({
  summary: z.string().describe('The summarized content of the article.'),
  keyPoints: z.array(z.string()).describe('Key points extracted from the article.'),
  impactAnalysis: z.string().describe('Analysis of the article\'s potential impact.'),
});
export type SummarizeFinancialArticleOutput = z.infer<
  typeof SummarizeFinancialArticleOutputSchema
>;

export async function summarizeFinancialArticle(
  input: SummarizeFinancialArticleInput
): Promise<SummarizeFinancialArticleOutput> {
  return summarizeFinancialArticleFlow(input);
}

const summarizeFinancialArticlePrompt = ai.definePrompt({
  name: 'summarizeFinancialArticlePrompt',
  input: {schema: SummarizeFinancialArticleInputSchema},
  output: {schema: SummarizeFinancialArticleOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to summarize financial articles based on the user's preferred style.

Article Content: {{{articleContent}}}

Summary Style: {{{summaryStyle}}}

Instructions:
- Provide a concise summary of the article.
- Extract the key points from the article.
- Analyze the potential impact of the article's content on the financial market or individual investors.

Output the summary, key points, and impact analysis in the format specified by the output schema. The output schema also contains descriptions to help guide you on how to populate those fields.
`,
});

const summarizeFinancialArticleFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialArticleFlow',
    inputSchema: SummarizeFinancialArticleInputSchema,
    outputSchema: SummarizeFinancialArticleOutputSchema,
  },
  async input => {
    const {output} = await summarizeFinancialArticlePrompt(input);
    return output!;
  }
);

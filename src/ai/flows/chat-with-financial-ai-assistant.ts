'use server';
/**
 * @fileOverview An AI agent that chats with the user about financial topics.
 *
 * - chatWithFinancialAiAssistant - A function that handles the chat process.
 * - ChatWithFinancialAiAssistantInput - The input type for the chatWithFinancialAiAssistant function.
 * - ChatWithFinancialAiAssistantOutput - The return type for the chatWithFinancialAiAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithFinancialAiAssistantInputSchema = z.object({
  message: z.string().describe('The user message.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history.'),
  userType: z.enum(['investor', 'student', 'SME', 'advisor']).default('investor').describe('The type of user.'),
});
export type ChatWithFinancialAiAssistantInput = z.infer<typeof ChatWithFinancialAiAssistantInputSchema>;

const ChatWithFinancialAiAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response.'),
});
export type ChatWithFinancialAiAssistantOutput = z.infer<typeof ChatWithFinancialAiAssistantOutputSchema>;

export async function chatWithFinancialAiAssistant(input: ChatWithFinancialAiAssistantInput): Promise<ChatWithFinancialAiAssistantOutput> {
  return chatWithFinancialAiAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithFinancialAiAssistantPrompt',
  input: {schema: ChatWithFinancialAiAssistantInputSchema},
  output: {schema: ChatWithFinancialAiAssistantOutputSchema},
  prompt: `You are a financial AI assistant that provides personalized advice and explanations.

You are currently talking to a user of type: {{{userType}}}.

{% if chatHistory %}
Here's the chat history:
{{#each chatHistory}}
{{role}}: {{content}}
{{/each}}
{% endif %}

user: {{{message}}}

assistant: `,
});

const chatWithFinancialAiAssistantFlow = ai.defineFlow(
  {
    name: 'chatWithFinancialAiAssistantFlow',
    inputSchema: ChatWithFinancialAiAssistantInputSchema,
    outputSchema: ChatWithFinancialAiAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

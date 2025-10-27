'use server';

/**
 * @fileOverview An AI agent to generate personalized financial plans.
 *
 * - generateFinancialPlan - A function that generates a financial plan.
 * - GenerateFinancialPlanInput - The input type for the generateFinancialPlan function.
 * - GenerateFinancialPlanOutput - The return type for the generateFinancialPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialPlanInputSchema = z.object({
  goal: z.string().describe('The financial goal of the user.'),
  timeframe: z.coerce.number().describe('The timeframe in years to achieve the goal.'),
  initialInvestment: z
    .number()
    .describe('The initial amount the user is investing.'),
  monthlyContribution: z
    .number()
    .describe('The monthly contribution towards the goal.'),
  riskTolerance: z
    .enum(['low', 'medium', 'high'])
    .describe('The risk tolerance of the user.'),
});
export type GenerateFinancialPlanInput = z.infer<
  typeof GenerateFinancialPlanInputSchema
>;

const GenerateFinancialPlanOutputSchema = z.object({
  plan: z.object({
    title: z.string().describe('A catchy title for the financial plan.'),
    summary: z
      .string()
      .describe('A brief summary of the financial plan.'),
    milestones: z
      .array(
        z.object({
          year: z.number().describe('The year of the milestone.'),
          description: z.string().describe('The description of the milestone.'),
        })
      )
      .describe('Key milestones in the financial plan.'),
    actionableSteps: z
      .array(z.string())
      .describe('Actionable steps for the user to take.'),
    investmentSuggestions: z
      .array(
        z.object({
          name: z.string().describe('The name of the investment.'),
          description: z
            .string()
            .describe('A description of the investment suggestion.'),
        })
      )
      .describe('Investment suggestions for the user.'),
    riskAnalysis: z
      .string()
      .describe('An analysis of the potential risks.'),
  }),
  projection: z
    .array(
      z.object({
        year: z.number().describe('The year of the projection.'),
        value: z
          .number()
          .describe('The projected value of the investment.'),
      })
    )
    .describe(
      'An array of projected values for each year of the plan, calculated using compound interest.'
    ),
});
export type GenerateFinancialPlanOutput = z.infer<
  typeof GenerateFinancialPlanOutputSchema
>;

export async function generateFinancialPlan(
  input: GenerateFinancialPlanInput
): Promise<GenerateFinancialPlanOutput> {
  return generateFinancialPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialPlanPrompt',
  input: {schema: GenerateFinancialPlanInputSchema},
  output: {schema: GenerateFinancialPlanOutputSchema},
  prompt: `You are an expert financial planner AI. Your task is to create a personalized financial plan and calculate its year-by-year projection based on user inputs.

User's Goal: {{{goal}}}
Timeframe: {{{timeframe}}} years
Initial Investment: ₹{{{initialInvestment}}}
Monthly Contribution: ₹{{{monthlyContribution}}}
Risk Tolerance: {{{riskTolerance}}}

Instructions:
1.  **Create a Comprehensive Plan**: Develop a financial plan with a title, summary, key milestones, actionable steps, investment suggestions tailored to the risk tolerance, and a risk analysis.
    - Low risk: Focus on conservative investments like bonds, index funds.
    - Medium risk: A balanced portfolio of stocks and bonds.
    - High risk: More aggressive investments like individual stocks, sector ETFs.
2.  **Calculate the Projection**: Generate a year-by-year projection of the investment's value. You must perform the calculation yourself.
    - Use the following annual growth rates based on risk tolerance:
      - Low: 5% (0.05)
      - Medium: 8% (0.08)
      - High: 11% (0.11)
    - **Formula**: The calculation for each year should be based on a standard future value of a series formula, compounded annually. The formula for the value at the end of a year is:
      FutureValue = (InitialInvestment * (1 + AnnualRate)^Year) + (MonthlyContribution * 12 * (((1 + AnnualRate)^Year - 1) / AnnualRate))
    - The projection should start from year 1 and go up to the user's specified timeframe. The 'year' in the output should be the calendar year (current year + N).
    - The final 'value' must be a number, rounded to two decimal places.

Your output must be a valid JSON object that adheres to the provided output schema.
`,
});

const generateFinancialPlanFlow = ai.defineFlow(
  {
    name: 'generateFinancialPlanFlow',
    inputSchema: GenerateFinancialPlanInputSchema,
    outputSchema: GenerateFinancialPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate financial plan');
    }
    return output;
  }
);

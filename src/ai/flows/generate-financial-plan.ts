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
  timeframe: z.number().describe('The timeframe in years to achieve the goal.'),
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
          ...

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  - A server/client branch `if (typeof window !== 'undefined')`.
> - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
> - Date formatting in a user's locale which doesn't match the server.
> - External changing data without sending a snapshot of it along with the HTML.
> - Invalid HTML tag nesting.
> 
> It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
> 
> See more info here: https://nextjs.org/docs/messages/react-hydration-error
> 
>   ...
>     <RedirectErrorBoundary router={{...}}>
>       <InnerLayoutRouter url="/cost" tree={[...]} cacheNode={{lazyData:null, ...}} segmentPath={[...]}>
>         <ClientPageRoot Component={function CostPage} searchParams={{}} params={{}}>
>           <CostPage params={Promise} searchParams={Promise}>
>             <div className="flex flex-col">
>               <div className="flex-col m...">
>                 <div className="flex-1 spa...">
>                   <div>
>                   <div className="grid gap-4...">> 
>                     <_c>
>                       <div ref={null} className="rounded-lg...">
>                         <_c2>
>                         <_c8>
>                           <div ref={null} className="p-6 pt-0">
>                             <div className="text-2xl f...">
> +                             163.34
> -                             154.23
>                             ...
>                     ...
>                   ...
>         ...
> 
> 
> src/app/cost/page.tsx (340:25) @ CostPage
> 
>   338 |                     </CardHeader>
>   339 |                     <CardContent>
> > 340 |                         <div className="text-2xl font-bold">${currentPeriodCost.toFixed(2)}</div>
>       |                         ^
>   341 |                         <p className="text-xs text-muted-foreground">{periodChange >= 0 ? '+' : ''}{periodChange.toFixed(1)}% from {prevPeriodLabel[reportPeriod]}</p>
>   342 |                     </CardContent>
>   343 |                 </Card>
> 
> Call Stack
> 13
> 
> Show 11 ignore-listed frame(s)
> div
> <anonymous> (0:0)
> CostPage
> src/app/cost/page.tsx (340:25)
- I see this error with the app, reported by NextJS, please fix it. The error is reported as HTML but presented visually to the user).

A > before the line number in the error source usually indicates the line of interest: 

> Runtime Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:. Error source: - A server/client branch `if (typeof window !== 'undefined')`.
> - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
> - Date formatting in a user's locale which doesn't match the server.
> - External changing data without sending a snapshot of it along with the HTML.
> - Invalid HTML tag nesting.
> 
> It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
> 
> See more info here: https://nextjs.org/docs/messages/react-hydration-error
> 
>   ...
>     <RedirectErrorBoundary router={{...}}>
>       <InnerLayoutRouter url="/cost" tree={[...]} cacheNode={{lazyData:null, ...}} segmentPath={[...]}>
>         <ClientPageRoot Component={function CostPage} searchParams={{}} params={{}}>
>           <CostPage params={Promise} searchParams={Promise}>
>             <div className="flex flex-col">
>               <div className="flex-col m...">
>                 <div className="flex-1 spa...">
>                   <div>
>                   <div className="grid gap-4...">> 
>                     <_c>
>                       <div ref={null} className="rounded-lg...">
>                         <_c2>
>                         <_c8>
>                           <div ref={null} className="p-6 pt-0">
>                             <div className="text-2xl f...">
> +                             163.34
> -                             154.23
>                             ...
>                     ...
>                   ...
>         ...
> 
> 
> src/app/cost/page.tsx (340:25) @ CostPage
> 
>   338 |                     </CardHeader>
>   339 |                     <CardContent>
> > 340 |                         <div className="text-2xl font-bold">${currentPeriodCost.toFixed(2)}</div>
>       |                         ^
>   341 |                         <p className="text-xs text-muted-foreground">{periodChange >= 0 ? '+' : ''}{periodChange.toFixed(1)}% from {prevPeriodLabel[reportPeriod]}</p>
>   342 |                     </CardContent>
>   343 |                 </Card>
> 
> Call Stack
> 13
> 
> Show 11 ignore-listed frame(s)
> div
> <anonymous> (0:0)
> CostPage
> src/app/cost/page.tsx (340:25)
- I see this error with the app, reported by NextJS, please fix it. The error is reported as HTML but presented visually to the user).

A > before the line number in the error source usually indicates the line of interest: 

> Runtime Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:. Error source: - A server/client branch `if (typeof window !== 'undefined')`.
> - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
> - Date formatting in a user's locale which doesn't match the server.
> - External changing data without sending a snapshot of it along with the HTML.
> - Invalid HTML tag nesting.
> 
> It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
> 
> See more info here: https://nextjs.org/docs/messages/react-hydration-error
> 
>   ...
>     <RedirectErrorBoundary router={{...}}>
>       <InnerLayoutRouter url="/cost" tree={[...]} cacheNode={{lazyData:null, ...}} segmentPath={[...]}>
>         <ClientPageRoot Component={function CostPage} searchParams={{}} params={{}}>
>           <CostPage params={Promise} searchParams={Promise}>
d.describe('The projected value of the investment.'),
      })
    )
    .describe(
      'An array of projected values for each year of the plan.'
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
  prompt: `You are an expert financial planner AI. Your task is to create a personalized financial plan for a user based on their goals and financial situation.

User's Goal: {{{goal}}}
Timeframe: {{{timeframe}}} years
Initial Investment: \${{{initialInvestment}}}
Monthly Contribution: \${{{monthlyContribution}}}
Risk Tolerance: {{{riskTolerance}}}

Instructions:
1.  Create a comprehensive financial plan with a title, summary, milestones, actionable steps, investment suggestions, and a risk analysis.
2.  The plan should be tailored to the user's risk tolerance.
    - Low risk: Focus on conservative investments like bonds, index funds.
    - Medium risk: A balanced portfolio of stocks and bonds.
    - High risk: More aggressive investments like individual stocks, sector ETFs, and a small allocation to crypto if appropriate.
3.  Generate a year-by-year projection of the investment's value. The growth rate should reflect the risk tolerance:
    - Low: 4-6% annual return.
    - Medium: 7-9% annual return.
    - High: 10-12% annual return.
    Calculate the future value for each year using a compound interest formula. For the calculation, assume contributions are made at the beginning of each month.

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
    // This is a simplified simulation for the projection.
    // A real implementation would use a more sophisticated financial model.
    const {
      timeframe,
      initialInvestment,
      monthlyContribution,
      riskTolerance,
    } = input;
    const rateMap = {
      low: 0.05, // 5%
      medium: 0.08, // 8%
      high: 0.11, // 11%
    };
    const annualRate = rateMap[riskTolerance];
    const monthlyRate = annualRate / 12;

    const projection = Array.from({length: timeframe + 1}, (_, year) => {
      let futureValue =
        initialInvestment * Math.pow(1 + annualRate, year);
      if (monthlyContribution > 0) {
        futureValue +=
          monthlyContribution *
          (((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate) *
            (1 + monthlyRate));
      }

      return {
        year: new Date().getFullYear() + year,
        value: parseFloat(futureValue.toFixed(2)),
      };
    });

    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate financial plan');
    }

    // Replace the AI's projection with our more controlled calculation
    output.projection = projection;

    return output;
  }
);

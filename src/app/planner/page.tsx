'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getFinancialPlan } from '@/lib/actions';
import {
  Loader2,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';
import type { GenerateFinancialPlanOutput } from '@/ai/flows/generate-financial-plan';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/page-header';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Separator } from '@/components/ui/separator';

const plannerFormSchema = z.object({
  goal: z.string().min(5, { message: 'Goal must be at least 5 characters.' }),
  timeframe: z.coerce.number().min(1, { message: 'Timeframe must be at least 1 year.' }).max(50),
  initialInvestment: z.coerce.number().min(0),
  monthlyContribution: z.coerce.number().min(0),
  riskTolerance: z.enum(['low', 'medium', 'high']),
});

type PlannerFormValues = z.infer<typeof plannerFormSchema>;

const defaultValues: Partial<PlannerFormValues> = {
  goal: 'Save for a house down payment',
  timeframe: 10,
  initialInvestment: 10000,
  monthlyContribution: 500,
  riskTolerance: 'medium',
};

export default function PlannerPage() {
  const { toast } = useToast();
  const [plan, setPlan] = useState<GenerateFinancialPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PlannerFormValues>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: PlannerFormValues) {
    setIsLoading(true);
    setPlan(null);
    try {
      const result = await getFinancialPlan(data);
      setPlan(result);
      toast({
        title: 'Financial Plan Generated!',
        description: "Your personalized plan is ready.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate plan',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="AI Financial Goal Planner"
        description="Define your financial goals and let our AI create a personalized roadmap for you."
      />
      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-2 self-start">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  Define Your Goal
                </CardTitle>
                <CardDescription>
                  Tell us what you're aiming for. The more specific, the better.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Goal</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Retire early, buy a car" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeframe (Years)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="initialInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                  control={form.control}
                  name="monthlyContribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Contribution ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Tolerance</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your risk tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate My Plan
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <div className="lg:col-span-3">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>{plan ? plan.plan.title : 'Your Personalized Plan'}</CardTitle>
              <CardDescription>
                {plan ? 'Generated by FinPulse AI' : 'Your generated plan will appear here.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                 <div className="space-y-6 pt-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Separator/>
                    <div className="h-48 w-full flex items-center justify-center">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                    <Separator/>
                     <Skeleton className="h-6 w-1/3" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                 </div>
              )}
              {plan && !isLoading && (
                <div className="space-y-6">
                   <div>
                    <h3 className="text-lg font-semibold flex items-center mb-2 text-primary">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        Plan Summary
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {plan.plan.summary}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center mb-4 text-primary">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Projected Growth
                    </h3>
                    <div className="h-[250px] w-full pr-4 -ml-4">
                        <ResponsiveContainer>
                            <LineChart data={plan.projection}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value/1000)}k`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: 'var(--radius)',
                                    }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(value:number) => [`$${Number(value).toLocaleString(undefined, {maximumFractionDigits:0})}`, 'Projected Value']}
                                />
                                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 6, className: "fill-primary" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center mb-2 text-primary">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Actionable Steps
                      </h3>
                      <ul className="space-y-3">
                          {plan.plan.actionableSteps.map((step, index) => (
                              <li key={index} className="flex items-start text-sm">
                                  <ArrowRight className="h-4 w-4 mr-2 mt-1 text-accent flex-shrink-0" />
                                  <span className="text-muted-foreground">{step}</span>
                              </li>
                          ))}
                      </ul>
                    </div>
                     <div>
                      <h3 className="text-lg font-semibold flex items-center mb-2 text-primary">
                          <ShieldAlert className="mr-2 h-5 w-5" />
                          Risk Analysis
                      </h3>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                          {plan.plan.riskAnalysis}
                        </p>
                    </div>
                  </div>
                </div>
              )}
               {!plan && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <Target className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <p className="font-semibold text-lg">Define your goal to start</p>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                        Fill out the form to let our AI generate a personalized financial plan, complete with projections and actionable steps.
                    </p>
                </div>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

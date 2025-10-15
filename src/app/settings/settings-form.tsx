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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { getPersonalizedRecommendations } from '@/lib/actions';
import { Loader2, Lightbulb, Sparkles } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const settingsFormSchema = z.object({
  financialInterests: z
    .string()
    .min(10, { message: 'Please describe your interests in at least 10 characters.' }),
  financialGoals: z
    .string()
    .min(10, { message: 'Please describe your goals in at least 10 characters.' }),
  riskTolerance: z.enum(['low', 'medium', 'high']),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  financialInterests: 'Investing in tech stocks and learning about cryptocurrencies.',
  financialGoals: 'Long-term growth, saving for retirement, and a down payment for a house.',
  riskTolerance: 'medium',
};

export function SettingsForm() {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getPersonalizedRecommendations(data);
      setRecommendations(result.recommendations);
      toast({
        title: 'Recommendations Generated',
        description: 'We\'ve tailored some content just for you.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to get recommendations',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CardHeader>
              <CardTitle>Your Financial Profile</CardTitle>
              <CardDescription>
                This information helps us personalize your AI experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="financialInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., stock market, real estate, personal budgeting..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What financial topics are you most interested in?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financialGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., saving for retirement, buying a home, paying off debt..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you trying to achieve financially?
                    </FormDescription>
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
                        <SelectItem value="low">Low - I prefer safety over high returns.</SelectItem>
                        <SelectItem value="medium">Medium - I'm willing to take balanced risks for moderate returns.</SelectItem>
                        <SelectItem value="high">High - I'm comfortable with high risk for potentially high returns.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How much investment risk are you willing to take on?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Get Personalized Recommendations
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Recommended Content</CardTitle>
          <CardDescription>
            Articles and topics tailored to your profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {recommendations && (
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Lightbulb className="h-4 w-4 mr-3 mt-1 text-primary flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          )}
          {!isLoading && !recommendations && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Lightbulb className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-semibold">Your recommendations will appear here</p>
              <p className="text-sm text-muted-foreground">
                Fill out and submit your profile to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

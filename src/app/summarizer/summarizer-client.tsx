'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { getArticleSummary } from '@/lib/actions';
import { Loader2, Wand2, Lightbulb, TrendingUp, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { SummarizeFinancialArticleOutput } from '@/ai/flows/summarize-financial-articles';
import { Skeleton } from '@/components/ui/skeleton';

export function SummarizerClient() {
  const [articleContent, setArticleContent] = useState('');
  const [summaryStyle, setSummaryStyle] = useState<'brief' | 'detailed' | 'actionable'>('brief');
  const [summary, setSummary] = useState<SummarizeFinancialArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!articleContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please paste the article content before summarizing.',
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await getArticleSummary({ articleContent, summaryStyle });
      setSummary(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'Could not generate summary. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Article Input</CardTitle>
          <CardDescription>
            Paste the full text of the financial article you want to summarize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your article here..."
            className="min-h-[300px] lg:min-h-[400px] resize-y"
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
          />
          <div className="space-y-2">
            <Label>Summary Style</Label>
            <RadioGroup
              defaultValue="brief"
              className="flex gap-4"
              onValueChange={(value: 'brief' | 'detailed' | 'actionable') => setSummaryStyle(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brief" id="r1" />
                <Label htmlFor="r1">Brief</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="r2" />
                <Label htmlFor="r2">Detailed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="actionable" id="r3" />
                <Label htmlFor="r3">Actionable</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Summarize
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>
            Here are the key takeaways from the article.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] lg:min-h-[400px] space-y-6">
          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                 <Skeleton className="h-5 w-1/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-5 w-1/3" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          )}
          {summary && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <Wand2 className="mr-2 h-5 w-5 text-primary" />
                  Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary.summary}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-1 bg-accent/20 border-accent/50 text-accent-foreground">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Impact Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary.impactAnalysis}
                </p>
              </div>
            </div>
          )}
          {!summary && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-semibold">Your summary will appear here</p>
              <p className="text-sm text-muted-foreground">
                Provide an article and select a style to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Medal, Repeat, Sparkles, Check, X } from 'lucide-react';
import type { QuizAttempt } from './quiz-client';
import { cn } from '@/lib/utils';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onNewQuiz: () => void;
}

const getBadge = (percentage: number) => {
  if (percentage > 75) return { name: 'Gold', className: 'badge-gold', icon: <Medal className="h-6 w-6 text-emerald-400" /> };
  if (percentage >= 50) return { name: 'Silver', className: 'badge-silver', icon: <Medal className="h-6 w-6 text-slate-400" /> };
  return { name: 'Bronze', className: 'badge-bronze', icon: <Medal className="h-6 w-6 text-orange-400" /> };
};

export function QuizResults({ attempt, onRetake, onNewQuiz }: QuizResultsProps) {
  const percentage = attempt.percentage;
  const badge = getBadge(percentage);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="text-center sticky top-6">
          <CardHeader>
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-muted animate-in zoom-in-50 delay-200">
                {badge.icon}
            </div>
            <CardTitle className="text-3xl font-bold pt-4">Quiz Completed!</CardTitle>
            <CardDescription>You've earned the {badge.name} badge.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</p>
            <Progress value={percentage} className="w-full" />
            <p className="text-muted-foreground">You answered {attempt.score} out of {attempt.numQuestions} questions correctly.</p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={onRetake} variant="outline">
              <Repeat className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
            <Button onClick={onNewQuiz}>
              <Sparkles className="mr-2 h-4 w-4" />
              New Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-2">
         <Card>
            <CardHeader>
                <CardTitle>Review Your Answers</CardTitle>
                <CardDescription>Here are the questions you answered incorrectly.</CardDescription>
            </CardHeader>
            <CardContent>
                 {attempt.incorrectAnswers.length > 0 ? (
                    <ScrollArea className="h-[500px]">
                        <Accordion type="single" collapsible className="w-full">
                        {attempt.incorrectAnswers.map(({ question, selectedAnswer }, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground flex-shrink-0 mt-1">
                                            <X className="h-4 w-4" />
                                        </div>
                                        <span>{question.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 pl-9">
                                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                                            <span className="font-semibold">Your Answer:</span>
                                            <span className="text-red-400">{question.options[selectedAnswer]}</span>
                                        </p>
                                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                                             <span className="font-semibold">Correct Answer:</span>
                                            <span className="text-green-400">{question.options[question.correctAnswerIndex]}</span>
                                        </p>
                                        <div className="p-3 bg-muted/50 rounded-lg">
                                            <p className="text-sm font-semibold">Explanation</p>
                                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-lg">
                        <Check className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold">Perfect Score!</h3>
                        <p className="text-muted-foreground">You answered all questions correctly. Great job!</p>
                    </div>
                )}
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

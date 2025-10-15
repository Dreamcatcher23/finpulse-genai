
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { getFinancialQuiz } from '@/lib/actions';
import type { GenerateFinancialQuizOutput } from '@/ai/flows/generate-financial-quiz';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
  Repeat,
  Trophy,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


type Quiz = GenerateFinancialQuizOutput['quiz'];

type QuizState = 'config' | 'playing' | 'results';

export function QuizClient() {
  const [topic, setTopic] = useState('Stock Market Basics');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [userType, setUserType] = useState<'investor' | 'student' | 'SME' | 'advisor'>('investor');
  const [numQuestions, setNumQuestions] = useState(5);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('config');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const { toast } = useToast();

  const handleStartQuiz = async () => {
    setIsLoading(true);
    setQuiz(null);
    setQuizState('config');
    try {
      const result = await getFinancialQuiz({ topic, difficulty, numQuestions, userType });
      setQuiz(result.quiz);
      setQuizState('playing');
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setScore(0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate quiz',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === quiz![currentQuestionIndex].correctAnswerIndex;
    if (isCorrect) {
        setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  }

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < numQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizState('results');
    }
  };

  const handleRestart = () => {
    setQuiz(null);
    setQuizState('config');
  }

  const currentQuestion = quiz ? quiz[currentQuestionIndex] : null;

  if (quizState === 'config') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Quiz</CardTitle>
          <CardDescription>
            Choose a topic and difficulty to start your personalized financial quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Personal Finance, Investing, etc."
              suppressHydrationWarning
            />
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
                  defaultValue={difficulty}
                >
                  <SelectTrigger id="difficulty" suppressHydrationWarning>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="userType">I am a...</Label>
                  <Select onValueChange={(value: 'investor' | 'student' | 'SME' | 'advisor') => setUserType(value)} defaultValue={userType}>
                    <SelectTrigger id="userType" suppressHydrationWarning>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="SME">SME Owner</SelectItem>
                      <SelectItem value="advisor">Financial Advisor</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="numQuestions">Number of Questions ({numQuestions})</Label>
            <Input type="range" id="numQuestions" min="3" max="10" value={numQuestions} onChange={e => setNumQuestions(parseInt(e.target.value, 10))} suppressHydrationWarning/>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} disabled={isLoading} suppressHydrationWarning>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (quizState === 'playing' && currentQuestion) {
    const progress = ((currentQuestionIndex) / numQuestions) * 100;
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <Progress value={progress} className="w-full mb-2" />
          <CardTitle>Question {currentQuestionIndex + 1}/{numQuestions}</CardTitle>
          <CardDescription className="text-lg font-semibold pt-2 min-h-[60px]">{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswer !== null ? String(selectedAnswer) : undefined}
            onValueChange={(value) => handleSelectAnswer(Number(value))}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, index) => {
              const isCorrect = index === currentQuestion.correctAnswerIndex;
              const isSelected = index === selectedAnswer;
              
              return (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className={cn(
                    "flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all hover:bg-muted/50",
                    isSelected && !isAnswered && "border-primary bg-primary/5",
                    isAnswered && isCorrect && "border-green-500 bg-green-500/10 text-green-800 dark:text-green-300",
                    isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-800 dark:text-red-300"
                  )}
                >
                  <RadioGroupItem value={String(index)} id={`option-${index}`} disabled={isAnswered} />
                  <span>{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                </Label>
              );
            })}
          </RadioGroup>
          {isAnswered && (
            <Alert className="mt-4" variant={selectedAnswer === currentQuestion.correctAnswerIndex ? 'default' : 'destructive'}>
                <AlertTitle className="flex items-center gap-2">
                    {selectedAnswer === currentQuestion.correctAnswerIndex ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    {selectedAnswer === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Incorrect'}
                </AlertTitle>
                <AlertDescription>
                    {currentQuestion.explanation}
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {isAnswered ? (
            <Button onClick={handleNextQuestion} suppressHydrationWarning>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null} suppressHydrationWarning>
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  if (quizState === 'results') {
    const percentage = (score / numQuestions) * 100;
    return (
        <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
                <Trophy className="mx-auto h-16 w-16 text-amber-400" />
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                <CardDescription>You've successfully completed the quiz on "{topic}".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-4xl font-bold">{percentage.toFixed(0)}%</p>
                <p className="text-muted-foreground">You answered {score} out of {numQuestions} questions correctly.</p>
                <Progress value={percentage} className="w-full" />
            </CardContent>
            <CardFooter className="justify-center">
                <Button onClick={handleRestart} suppressHydrationWarning>
                    <Repeat className="mr-2 h-4 w-4" />
                    Take Another Quiz
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return null;
}

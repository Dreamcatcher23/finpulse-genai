'use client';

import { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getFinancialQuiz } from '@/lib/actions';
import type { GenerateFinancialQuizOutput } from '@/ai/flows/generate-financial-quiz';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QuizHistory } from './quiz-history';
import { QuizResults } from './quiz-results';

export type Quiz = GenerateFinancialQuizOutput['quiz'];
type Question = Quiz[0];
type QuizState = 'config' | 'playing' | 'results';

export type QuizAttempt = {
  id: string;
  date: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numQuestions: number;
  score: number;
  percentage: number;
  incorrectAnswers: { question: Question; selectedAnswer: number }[];
};

const mockUserNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Jessie', 'Drew', 'Morgan'];

function getRandomUserName() {
    return mockUserNames[Math.floor(Math.random() * mockUserNames.length)];
}

export function QuizClient() {
  // Config state
  const [topic, setTopic] = useState('Stock Market Basics');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [userType, setUserType] = useState<'investor' | 'student' | 'SME' | 'advisor'>('investor');
  const [numQuestions, setNumQuestions] = useState(5);

  // Game state
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('config');
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<{ question: Question; selectedAnswer: number }[]>([]);

  // History & Leaderboard state
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ name: string; score: number }[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('quizHistory');
      if (storedHistory) {
        setQuizHistory(JSON.parse(storedHistory));
      }
      const storedLeaderboard = localStorage.getItem('quizLeaderboard');
      if (storedLeaderboard) {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } else {
        // Seed leaderboard with mock data only on client
        const mockLeaderboard = Array.from({ length: 5 }, (_, i) => ({
            name: getRandomUserName(),
            score: Math.floor(Math.random() * 3000) + 2000 * (5 - i)
        })).sort((a,b) => b.score - a.score);
        setLeaderboard(mockLeaderboard);
        localStorage.setItem('quizLeaderboard', JSON.stringify(mockLeaderboard));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, []);

  const resetQuizState = () => {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIncorrectAnswers([]);
  };

  const handleStartQuiz = async (retakeTopic?: string, retakeDifficulty?: 'easy' | 'medium' | 'hard') => {
    setIsLoading(true);
    resetQuizState();

    const quizTopic = retakeTopic || topic;
    const quizDifficulty = retakeDifficulty || difficulty;
    
    try {
      const result = await getFinancialQuiz({ topic: quizTopic, difficulty: quizDifficulty, numQuestions, userType });
      if (result.quiz.length < numQuestions) {
         setNumQuestions(result.quiz.length); // Adjust if AI returns fewer questions
      }
      setQuiz(result.quiz);
      setQuizState('playing');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to generate quiz',
        description: 'Please try again later.',
      });
      setQuizState('config');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };
  
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !quiz) return;
    const currentQuestion = quiz[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => [...prev, { question: currentQuestion, selectedAnswer }]);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.length - 1) {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // End of quiz
      const newAttempt: QuizAttempt = {
        id: new Date().toISOString(),
        date: new Date().toISOString(),
        topic: topic,
        difficulty: difficulty,
        numQuestions: quiz.length,
        score: score,
        percentage: (score / quiz.length) * 100,
        incorrectAnswers: incorrectAnswers
      };

      // Update history
      const updatedHistory = [...quizHistory, newAttempt];
      setQuizHistory(updatedHistory);
      localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));

      // Update leaderboard
      const points = Math.floor(newAttempt.percentage * 100 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2));
      const newLeaderboard = [...leaderboard, { name: 'You', score: points }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      setLeaderboard(newLeaderboard);
      localStorage.setItem('quizLeaderboard', JSON.stringify(newLeaderboard));

      setQuizState('results');
    }
  };

  const handleNewQuiz = () => {
    resetQuizState();
    setQuizState('config');
  }

  const currentQuestion = quiz ? quiz[currentQuestionIndex] : null;

  if (quizState === 'config') {
    return (
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
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
              />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}
                    defaultValue={difficulty}
                  >
                    <SelectTrigger id="difficulty">
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
                      <SelectTrigger id="userType">
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
              <Input type="range" id="numQuestions" min="3" max="10" value={numQuestions} onChange={e => setNumQuestions(parseInt(e.target.value, 10))}/>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleStartQuiz()} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Quiz
            </Button>
          </CardFooter>
        </Card>
        <div className="lg:col-span-2">
           <QuizHistory history={quizHistory} leaderboard={leaderboard} />
        </div>
      </div>
    );
  }

  if (quizState === 'playing' && currentQuestion) {
    const progress = ((currentQuestionIndex) / quiz.length) * 100;
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <Progress value={progress} className="w-full mb-2" />
          <CardTitle>Question {currentQuestionIndex + 1}/{quiz.length}</CardTitle>
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
            <Button onClick={handleNextQuestion}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmitAnswer} disabled={selectedAnswer === null}>
              Submit Answer
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  if (quizState === 'results' && quiz) {
    const lastAttempt = quizHistory[quizHistory.length - 1];
    return (
       <QuizResults 
          attempt={lastAttempt}
          onRetake={() => handleStartQuiz(topic, difficulty)}
          onNewQuiz={handleNewQuiz}
        />
    )
  }

  return null;
}

    
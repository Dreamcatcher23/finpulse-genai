'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { QuizAttempt } from './quiz-client';
import { format } from 'date-fns';
import { Medal, Crown, Star, History, TrendingUp, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuizHistoryProps {
  history: QuizAttempt[];
  leaderboard: { name: string; score: number }[];
}

const getBadge = (percentage: number) => {
  if (percentage > 75) return { name: 'Gold', className: 'badge-gold', icon: <Medal className="h-4 w-4 text-emerald-400" /> };
  if (percentage >= 50) return { name: 'Silver', className: 'badge-silver', icon: <Medal className="h-4 w-4 text-slate-400" /> };
  return { name: 'Bronze', className: 'badge-bronze', icon: <Medal className="h-4 w-4 text-orange-400" /> };
};

export function QuizHistory({ history, leaderboard }: QuizHistoryProps) {
  const chartData = history.map(attempt => ({
    date: format(new Date(attempt.date), 'MMM dd'),
    score: attempt.percentage,
  }));
  
  const leaderboardIcons = [
    <Crown key="1" className="h-5 w-5 text-amber-400" />,
    <Trophy key="2" className="h-5 w-5 text-slate-400" />,
    <Star key="3" className="h-5 w-5 text-orange-400" />,
  ]

  return (
    <div className="space-y-8">
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Quiz History
            </CardTitle>
            <CardDescription>Your past quiz performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72">
              {history.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Topic</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.slice().reverse().map(attempt => {
                      const badge = getBadge(attempt.percentage);
                      return (
                        <TableRow key={attempt.id}>
                          <TableCell className="font-medium">{attempt.topic}</TableCell>
                          <TableCell>{`${attempt.score}/${attempt.numQuestions}`}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-xs", badge.className)}>
                              {badge.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(attempt.date), 'dd/MM/yy')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground p-8">
                  <p>No quiz attempts yet.</p>
                  <p className="text-sm">Complete a quiz to see your history.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top 5 scores across all users.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {leaderboard.map((player, index) => (
                <li key={index} className="flex items-center gap-4 p-2 rounded-lg bg-muted/30">
                  <div className="w-6 text-center text-lg font-bold text-muted-foreground">
                    {index < 3 ? leaderboardIcons[index] : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{player.name}</p>
                  </div>
                  <p className="font-bold text-lg text-primary">{player.score.toLocaleString()} pts</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Over Time
          </CardTitle>
          <CardDescription>Your quiz score percentage trend.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            {history.length > 0 ? (
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={value => `${value}%`} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value) => [`${value}%`, 'Score']}
                    />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8, className: 'fill-primary' }} />
                </LineChart>
            ) : (
                 <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Complete a few quizzes to see your performance chart.</p>
                </div>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

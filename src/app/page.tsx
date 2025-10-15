import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

import {
  Bot,
  FileText,
  BrainCircuit,
  Settings,
  Trophy,
  BarChart,
} from 'lucide-react';

const kpiData = [
  {
    title: 'Total AI Spend',
    value: '$45,231.89',
    change: '+20.1% from last month',
    icon: DollarSign,
  },
  {
    title: 'Active Users',
    value: '+2350',
    change: '+180.1% from last month',
    icon: Users,
  },
  {
    title: 'Daily Challenges',
    value: '+12,234',
    change: '+19% from last month',
    icon: Trophy,
  },
  {
    title: 'API Calls',
    value: '+573',
    change: '+201 since last hour',
    icon: Activity,
  },
];

const featureCards = [
  {
    title: 'AI Chat',
    description: 'Engage with our intelligent financial AI executives.',
    icon: Bot,
    link: '/chat',
    color: 'text-sky-500',
    bgColor: 'bg-sky-50',
  },
  {
    title: 'Content Summarizer',
    description: 'Get key insights from long financial articles instantly.',
    icon: FileText,
    link: '/summarizer',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Gamified Quiz',
    description: 'Test your financial knowledge and earn rewards.',
    icon: BrainCircuit,
    link: '/quiz',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  {
    title: 'Cost Management',
    description: 'Monitor and optimize your AI service usage costs.',
    icon: BarChart,
    link: '/cost',
    color: 'text-rose-500',
    bgColor: 'bg-rose-50',
  },
  {
    title: 'Personalized Settings',
    description: 'Customize your profile, preferences, and more.',
    icon: Settings,
    link: '/settings',
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center">
        <h1 className="font-headline text-2xl font-bold tracking-tight">
          Welcome to your Financial Intelligence Hub
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Core Features</CardTitle>
              <CardDescription>
                Access powerful AI tools to enhance your financial literacy.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <div className="group flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-6 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md">
                  <div
                    className={`rounded-full p-3 ${feature.bgColor} transition-colors group-hover:bg-primary/10`}
                  >
                    <feature.icon
                      className={`h-8 w-8 ${feature.color} transition-colors group-hover:text-primary`}
                    />
                  </div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              An overview of recent AI interactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    Completed 'Budgeting' quiz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    Summarized an article
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      noah@example.com
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    Chatted with AI assistant
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

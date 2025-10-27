'use client';

import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  ChevronRight,
  Target,
} from 'lucide-react';
import { MarketInsightsCard } from '@/components/market-insights-card';
import { cn } from '@/lib/utils';


const initialKpiData = [
  {
    title: 'Total AI Spend',
    value: '$0.00',
    change: '+0% from last month',
    icon: DollarSign,
  },
  {
    title: 'Active Users',
    value: '+0',
    change: '+0% from last month',
    icon: Users,
  },
  {
    title: 'Daily Challenges',
    value: '+0',
    change: '+0% from last month',
    icon: Trophy,
  },
  {
    title: 'API Calls',
    value: '+0',
    change: '+0 since last hour',
    icon: Activity,
  },
];

const featureCards = [
   {
    title: 'Financial Planner',
    description: 'Create a personalized roadmap to achieve your financial goals.',
    icon: Target,
    link: '/planner',
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    title: 'AI Financial Chat',
    description: 'Engage with our intelligent financial AI for personalized advice.',
    icon: Bot,
    link: '/chat',
    gradient: 'from-cyan-500 to-cyan-600',
    shadow: 'shadow-cyan-500/20',
  },
  {
    title: 'Content Summarizer',
    description: 'Get key insights from long financial articles and reports instantly.',
    icon: FileText,
    link: '/summarizer',
    gradient: 'from-teal-500 to-teal-600',
    shadow: 'shadow-teal-500/20',
  },
  {
    title: 'Gamified Quizzes',
    description: 'Test your financial knowledge, compete, and earn rewards.',
    icon: BrainCircuit,
    link: '/quiz',
    gradient: 'from-indigo-500 to-indigo-600',
    shadow: 'shadow-indigo-500/20',
  },
  {
    title: 'Cost Management',
    description: 'Monitor, analyze, and optimize your AI service usage costs.',
    icon: BarChart,
    link: '/cost',
    gradient: 'from-rose-500 to-rose-600',
    shadow: 'shadow-rose-500/20',
  },
  {
    title: 'Personalized Settings',
    description: 'Customize your profile, content preferences, and notifications.',
    icon: Settings,
    link: '/settings',
    gradient: 'from-slate-500 to-slate-600',
    shadow: 'shadow-slate-500/20',
  },
];

export default function Dashboard() {
  const [kpiData, setKpiData] = useState(initialKpiData);

  useEffect(() => {
    const generateKpiValue = (base: number, variance: number) => base + Math.random() * variance;
    const formatCurrency = (value: number) => `$${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    const formatNumber = (value: number) => `+${Math.floor(value).toLocaleString()}`;
    const formatPercent = (value: number) => `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;

    const newKpiData = [
      {
        title: 'Total AI Spend',
        value: formatCurrency(generateKpiValue(45000, 5000)),
        change: `${formatPercent(Math.random() * 0.3)} from last month`,
        icon: DollarSign,
      },
      {
        title: 'Active Users',
        value: formatNumber(generateKpiValue(2300, 500)),
        change: `${formatPercent(Math.random() * 2)} from last month`,
        icon: Users,
      },
      {
        title: 'Daily Challenges',
        value: formatNumber(generateKpiValue(12000, 1000)),
        change: `${formatPercent(Math.random() * 0.2)} from last month`,
        icon: Trophy,
      },
      {
        title: 'API Calls',
        value: formatNumber(generateKpiValue(500, 100)),
        change: `${formatPercent(Math.random() * 3)} since last hour`,
        icon: Activity,
      },
    ];
    setKpiData(newKpiData);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            Welcome Back!
            </h1>
            <p className="text-muted-foreground">Here&apos;s your financial intelligence overview.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={kpi.title} className={cn(
            "hover:border-primary/50 transition-colors",
            index === 0 && 'bg-primary/5',
          )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={cn("h-4 w-4 text-muted-foreground", index === 0 && 'text-primary')} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 grid gap-4">
           <Card>
               <CardHeader>
                  <CardTitle>Core Features</CardTitle>
                  <CardDescription>
                    Access powerful AI tools to enhance your financial journey.
                  </CardDescription>
              </CardHeader>
               <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featureCards.map((feature) => (
                        <Link href={feature.link} key={feature.title}>
                            <div className={cn(
                              "group relative flex items-start gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md h-full",
                              feature.shadow
                            )}>
                                <div className={`relative shrink-0 rounded-lg p-3 bg-gradient-to-br ${feature.gradient} text-white`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <div className="relative flex-1">
                                    <p className="font-semibold">{feature.title}</p>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </CardContent>
           </Card>
        </div>
        <div className="lg:col-span-5 grid gap-4">
           <MarketInsightsCard />
           <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                An overview of recent AI interactions and activities.
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
                      <div className="flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                          <AvatarImage data-ai-hint="person face" src="https://picsum.photos/seed/120/40/40" />
                          <AvatarFallback>LJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Liam Johnson</div>
                          <div className="text-sm text-muted-foreground">
                            liam@example.com
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      Completed 'Budgeting' quiz
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                          <AvatarImage data-ai-hint="person face" src="https://picsum.photos/seed/121/40/40" />
                          <AvatarFallback>OS</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Olivia Smith</div>
                          <div className="text-sm text-muted-foreground">
                            olivia@example.com
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      Summarized an article
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                       <div className="flex items-center gap-3">
                         <Avatar className="h-8 w-8">
                          <AvatarImage data-ai-hint="person face" src="https://picsum.photos/seed/122/40/40" />
                          <AvatarFallback>NW</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">Noah Williams</div>
                          <div className="text-sm text-muted-foreground">
                            noah@example.com
                          </div>
                        </div>
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
    </div>
  );
}

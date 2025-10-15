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
} from 'lucide-react';

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
    title: 'AI Financial Chat',
    description: 'Engage with our intelligent financial AI executives for personalized advice.',
    icon: Bot,
    link: '/chat',
    gradient: 'from-sky-500 to-sky-600',
    shadow: 'shadow-sky-500/30',
  },
  {
    title: 'Content Summarizer',
    description: 'Get key insights from long financial articles and reports instantly.',
    icon: FileText,
    link: '/summarizer',
    gradient: 'from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/30',
  },
  {
    title: 'Gamified Quizzes',
    description: 'Test your financial knowledge, compete, and earn rewards.',
    icon: BrainCircuit,
    link: '/quiz',
    gradient: 'from-amber-500 to-amber-600',
    shadow: 'shadow-amber-500/30',
  },
  {
    title: 'Cost Management',
    description: 'Monitor, analyze, and optimize your AI service usage costs.',
    icon: BarChart,
    link: '/cost',
    gradient: 'from-rose-500 to-rose-600',
    shadow: 'shadow-rose-500/30',
  },
  {
    title: 'Personalized Settings',
    description: 'Customize your profile, content preferences, and notifications.',
    icon: Settings,
    link: '/settings',
    gradient: 'from-indigo-500 to-indigo-600',
    shadow: 'shadow-indigo-500/30',
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
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-lg transition-shadow">
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
      <div className="grid gap-4 md:gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
              <CardTitle>Core Features</CardTitle>
              <CardDescription>
                Access powerful AI tools to enhance your financial journey.
              </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureCards.slice(0, 3).map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <div
                  className={`group relative overflow-hidden rounded-xl p-6 text-white bg-gradient-to-br ${feature.gradient} transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl ${feature.shadow}`}
                >
                  <div className="relative z-10 flex flex-col h-full">
                    <feature.icon
                      className="h-8 w-8 mb-4"
                    />
                    <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                    <p className="text-xs text-white/80 flex-1">{feature.description}</p>
                    <div className="flex items-center text-xs font-semibold mt-4">
                      <span>Explore</span>
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 h-20 w-20 bg-white/10 rounded-full-top-left transform-gpu -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-in-out"></div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-5">
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
                    <div className="font-medium">Liam Johnson</div>
                    <div className="text-sm text-muted-foreground">
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
                    <div className="text-sm text-muted-foreground">
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
                    <div className="text-sm text-muted-foreground">
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
       <Card>
           <CardHeader>
              <CardTitle>More Tools</CardTitle>
              <CardDescription>
                Discover more features to supercharge your financial intelligence.
              </CardDescription>
          </CardHeader>
           <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureCards.slice(3).map((feature) => (
                    <Link href={feature.link} key={feature.title}>
                        <div className="group flex items-center gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-muted/50 hover:shadow-md">
                            <div className={`rounded-lg p-3 bg-gradient-to-br ${feature.gradient} text-white`}>
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{feature.title}</p>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </CardContent>
       </Card>
    </div>
  );
}

// Custom CSS in a style tag for the radial gradient effect on feature cards
const style = `
  .rounded-full-top-left {
    border-top-left-radius: 9999px;
    border-bottom-right-radius: 9999px;
  }
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = style;
  document.head.appendChild(styleSheet);
}

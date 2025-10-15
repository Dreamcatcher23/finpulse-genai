'use client';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileDown, Circle, DollarSign, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { format, startOfWeek, startOfMonth, startOfYear, parseISO, subDays, subMonths, subYears, endOfWeek, endOfMonth, endOfYear } from 'date-fns';


// Generate more detailed mock data for reports
const generateDailyData = () => {
    const data = [];
    const services = ['OpenAI', 'Anthropic', 'Google Gemini'];
    const today = new Date();
    for (let i = 0; i < 365; i++) { // Generate data for a full year
        const date = new Date();
        date.setDate(today.getDate() - i);
        for (const service of services) {
            const cost = Math.random() * 5 + (service === 'OpenAI' ? 2 : service === 'Anthropic' ? 1 : 0.5);
            const tokens = Math.floor(Math.random() * 10000 + 5000);
            data.push({
                date: date.toISOString().split('T')[0],
                service,
                cost,
                tokens
            });
        }
    }
    return data;
};

const dailyData = generateDailyData();


export default function CostPage() {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const serviceColors = {
    'OpenAI': 'hsl(var(--chart-1))',
    'Anthropic': 'hsl(var(--chart-2))',
    'Google Gemini': 'hsl(var(--chart-4))',
  };

  const totalCostThisMonth = useMemo(() => {
    const thisMonthData = dailyData.filter(d => format(parseISO(d.date), 'yyyy-MM') === format(new Date(), 'yyyy-MM'));
    return thisMonthData.reduce((acc, curr) => acc + curr.cost, 0);
  }, []);

  const totalCostLastMonth = useMemo(() => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthData = dailyData.filter(d => format(parseISO(d.date), 'yyyy-MM') === format(lastMonth, 'yyyy-MM'));
    return lastMonthData.reduce((acc, curr) => acc + curr.cost, 0);
  }, []);
  
  const monthlyChange = totalCostLastMonth > 0 ? ((totalCostThisMonth - totalCostLastMonth) / totalCostLastMonth) * 100 : 0;
  const monthlyBudget = 1000;
  const budgetUsage = (totalCostThisMonth / monthlyBudget) * 100;
  const projectedCost = totalCostThisMonth * 1.2; // Simplified projection

  const processDataForChart = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      const aggregation: { [key: string]: { [service: string]: number } } = {};
  
      dailyData.forEach(item => {
          const date = parseISO(item.date);
          let key = '';
          if (period === 'daily') {
              key = format(date, 'MMM dd');
          } else if (period === 'weekly') {
              key = format(startOfWeek(date), 'MMM dd');
          } else if (period === 'monthly') {
              key = format(startOfMonth(date), 'MMM yyyy');
          } else if (period === 'yearly') {
              key = format(startOfYear(date), 'yyyy');
          }
  
          if (!aggregation[key]) aggregation[key] = { 'OpenAI': 0, 'Anthropic': 0, 'Google Gemini': 0 };
          aggregation[key][item.service] = (aggregation[key][item.service] || 0) + item.cost;
      });
      
      let chartFormattedData = Object.entries(aggregation).map(([periodKey, services]) => ({
          Period: periodKey,
          openai: parseFloat(services['OpenAI']?.toFixed(2) || '0'),
          anthropic: parseFloat(services['Anthropic']?.toFixed(2) || '0'),
          gemini: parseFloat(services['Google Gemini']?.toFixed(2) || '0'),
      }));
      
      // Sorting logic depends on the period
      if (period === 'yearly') {
          chartFormattedData = chartFormattedData.sort((a,b) => new Date(a.Period).getFullYear() - new Date(b.Period).getFullYear());
      } else {
          chartFormattedData = chartFormattedData.sort((a,b) => new Date(a.Period).getTime() - new Date(b.Period).getTime());
      }

      // Limit data points for readability
      if (period === 'daily') {
        return chartFormattedData.slice(-30);
      }
      if (period === 'weekly') {
        return chartFormattedData.slice(-26);
      }
       if (period === 'monthly') {
        return chartFormattedData.slice(-12);
      }

      return chartFormattedData;
  };
  
  const processDataForPieChart = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
      const serviceBreakdown: { [service: string]: number } = { 'OpenAI': 0, 'Anthropic': 0, 'Google Gemini': 0 };
      const now = new Date();
      let startDate: Date;

      switch(period) {
        case 'daily':
            startDate = now;
            break;
        case 'weekly':
            startDate = startOfWeek(now);
            break;
        case 'monthly':
            startDate = startOfMonth(now);
            break;
        case 'yearly':
            startDate = startOfYear(now);
            break;
        default:
            startDate = startOfMonth(now);
      }
      
      const filteredData = dailyData.filter(item => parseISO(item.date) >= startDate);

      filteredData.forEach(item => {
        serviceBreakdown[item.service] = (serviceBreakdown[item.service] || 0) + item.cost;
      });
      
      return Object.entries(serviceBreakdown).map(([name, value]) => ({
          name,
          value: parseFloat(value.toFixed(2)),
          color: serviceColors[name as keyof typeof serviceColors],
      })).filter(item => item.value > 0);
  };

  useEffect(() => {
    const barData = processDataForChart(reportPeriod);
    setChartData(barData);

    const pieData = processDataForPieChart(reportPeriod);
    setPieData(pieData);
  }, [reportPeriod]);

  const processDataForReport = (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    const aggregation: { [key: string]: { [service: string]: { cost: number; tokens: number } } } = {};

    dailyData.forEach(item => {
        const date = parseISO(item.date);
        let key = '';
        if (period === 'daily') {
            key = format(date, 'yyyy-MM-dd');
        } else if (period === 'weekly') {
            key = format(startOfWeek(date), 'yyyy-MM-dd');
        } else if (period === 'monthly') {
            key = format(startOfMonth(date), 'yyyy-MM');
        } else if (period === 'yearly') {
            key = format(startOfYear(date), 'yyyy');
        }

        if (!aggregation[key]) aggregation[key] = {};
        if (!aggregation[key][item.service]) aggregation[key][item.service] = { cost: 0, tokens: 0 };

        aggregation[key][item.service].cost += item.cost;
        aggregation[key][item.service].tokens += item.tokens;
    });
    
    const flatData = Object.entries(aggregation).map(([periodKey, services]) => {
        const row: any = { Period: periodKey };
        let totalCost = 0;
        let totalTokens = 0;
        
        Object.entries(services).forEach(([serviceName, data]) => {
            row[`${serviceName} Cost ($)`] = data.cost.toFixed(2);
            row[`${serviceName} Tokens`] = data.tokens;
            totalCost += data.cost;
            totalTokens += data.tokens;
        });

        row['Total Cost ($)'] = totalCost.toFixed(2);
        row['Total Tokens'] = totalTokens;
        return row;
    });

    return flatData.sort((a,b) => new Date(b.Period).getTime() - new Date(a.Period).getTime());
  };

  const handleDownloadReport = () => {
    const processedData = processDataForReport(reportPeriod);
    if(processedData.length === 0) return;

    const headers = Object.keys(processedData[0]);
    const csvContent = [
      headers.join(','),
      ...processedData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportPeriod}_usage_report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col">
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Cost Management</h2>
                    <p className="text-muted-foreground">
                        Monitor, analyze, and optimize your AI service expenditures.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Select value={reportPeriod} onValueChange={(value: any) => setReportPeriod(value)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Report Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleDownloadReport}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Cost (This Month)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCostThisMonth.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">{monthlyChange >= 0 ? '+' : ''}{monthlyChange.toFixed(1)}% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Budget Usage</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{budgetUsage.toFixed(1)}%</div>
                        <Progress value={budgetUsage} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projected Cost</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${projectedCost.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Based on current usage</p>
                    </CardContent>
                </Card>
                <Card className="bg-destructive text-destructive-foreground">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1 Active</div>
                        <p className="text-xs">Budget at 85%</p>
                    </CardContent>
                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Usage Over Time</CardTitle>
                        <CardDescription>AI service costs for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="Period" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend iconType="circle" />
                                <Bar dataKey="openai" name="OpenAI" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="anthropic" name="Anthropic" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} stackId="a" />
                                <Bar dataKey="gemini" name="Google Gemini" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} stackId="a" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cost Breakdown by Service</CardTitle>
                        <CardDescription>Cost distribution for the selected period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                             <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="flex justify-center space-x-4 text-sm text-muted-foreground mt-4">
                            {pieData.map(service => (
                                <div key={service.name} className="flex items-center">
                                    <Circle className="h-2.5 w-2.5 mr-1.5" style={{ fill: service.color, color: service.color }} />
                                    {service.name}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );

    

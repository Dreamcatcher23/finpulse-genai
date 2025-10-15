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
import { FileDown, Circle } from 'lucide-react';

const monthlyUsage = [
  { month: 'Jan', openai: 120, anthropic: 90, gemini: 60, total: 270 },
  { month: 'Feb', openai: 150, anthropic: 110, gemini: 70, total: 330 },
  { month: 'Mar', openai: 180, anthropic: 130, gemini: 90, total: 400 },
  { month: 'Apr', openai: 160, anthropic: 120, gemini: 80, total: 360 },
  { month: 'May', openai: 210, anthropic: 150, gemini: 100, total: 460 },
  { month: 'Jun', openai: 250, anthropic: 180, gemini: 120, total: 550 },
];

const serviceBreakdown = [
  { name: 'OpenAI', value: 55, color: 'hsl(var(--chart-1))' },
  { name: 'Anthropic', value: 30, color: 'hsl(var(--chart-2))' },
  { name: 'Google Gemini', value: 15, color: 'hsl(var(--chart-4))' },
];

export default function CostPage() {
  const totalCost = 550;
  const monthlyBudget = 1000;
  const budgetUsage = (totalCost / monthlyBudget) * 100;

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
                    <Button>
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
                        <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+35.2% from last month</p>
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
                        <div className="text-2xl font-bold">${(totalCost * 1.2).toFixed(2)}</div>
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
                        <CardDescription>Monthly AI service costs.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={monthlyUsage}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                                <Legend iconType="circle" />
                                <Bar dataKey="openai" name="OpenAI" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="anthropic" name="Anthropic" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="gemini" name="Google Gemini" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Cost Breakdown by Service</CardTitle>
                        <CardDescription>Current month's AI cost distribution.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                             <PieChart>
                                <Pie data={serviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
                                    {serviceBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                         <div className="flex justify-center space-x-4 text-sm text-muted-foreground mt-4">
                            {serviceBreakdown.map(service => (
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
}

// Dummy icons for compilation
const DollarSign = ({ className }: { className: string }) => <svg className={className} />;
const CreditCard = ({ className }: { className:string }) => <svg className={className} />;
const TrendingUp = ({ className }: { className: string }) => <svg className={className} />;
const AlertTriangle = ({ className }: { className: string }) => <svg className={className} />;

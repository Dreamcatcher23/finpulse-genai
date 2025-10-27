'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Separator } from '@/components/ui/separator';

const sipFormSchema = z.object({
  monthlyInvestment: z.coerce.number().min(1, 'Must be at least 1.'),
  timePeriod: z.coerce.number().min(1, 'Must be at least 1 year.'),
  returnRate: z.coerce.number().min(0, 'Cannot be negative.'),
});

type SipFormValues = z.infer<typeof sipFormSchema>;

interface SipResult {
  totalInvested: number;
  expectedReturns: number;
  maturityValue: number;
}

export function SipCalculator() {
  const [result, setResult] = useState<SipResult | null>(null);

  const form = useForm<SipFormValues>({
    resolver: zodResolver(sipFormSchema),
    defaultValues: {
      monthlyInvestment: 10000,
      timePeriod: 10,
      returnRate: 12,
    },
  });

  function onSubmit(data: SipFormValues) {
    const P = data.monthlyInvestment;
    const n = data.timePeriod * 12; // in months
    const i = data.returnRate / 100 / 12; // monthly rate

    const maturityValue = P * (((1 + i) ** n - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const expectedReturns = maturityValue - totalInvested;

    setResult({
      totalInvested,
      expectedReturns,
      maturityValue,
    });
  }
  
  const chartData = result ? [
    { name: 'Investment', "Total Invested": result.totalInvested, "Expected Returns": result.expectedReturns }
  ] : [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="monthlyInvestment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Investment (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timePeriod"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Time Period ({value} Years)</FormLabel>
                <FormControl>
                    <Slider
                        min={1}
                        max={40}
                        step={1}
                        value={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="returnRate"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Expected Return Rate ({value} % p.a.)</FormLabel>
                <FormControl>
                     <Slider
                        min={1}
                        max={30}
                        step={0.5}
                        value={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> Calculate
          </Button>
        </form>
      </Form>

      <div className="flex flex-col justify-center items-center p-6 bg-muted/50 rounded-lg">
        {!result && (
          <div className="text-center text-muted-foreground">
             <p className="text-lg font-semibold">Results will be displayed here.</p>
             <p className="text-sm">Adjust the values and click calculate.</p>
          </div>
        )}
        {result && (
          <div className="w-full space-y-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Maturity Value</p>
              <p className="text-4xl font-bold text-primary">
                ₹{result.maturityValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <Separator />
            <div className="flex justify-around">
              <div >
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-xl font-semibold">₹{result.totalInvested.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Returns</p>
                <p className="text-xl font-semibold">₹{result.expectedReturns.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="Total Invested" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 0, 0, 4]} />
                        <Bar dataKey="Expected Returns" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

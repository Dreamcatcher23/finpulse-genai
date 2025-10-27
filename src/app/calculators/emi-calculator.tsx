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
import { Calculator } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Separator } from '@/components/ui/separator';


const emiFormSchema = z.object({
  loanAmount: z.coerce.number().min(1, 'Must be at least 1.'),
  interestRate: z.coerce.number().min(0.1, 'Must be at least 0.1%.'),
  tenure: z.coerce.number().min(1, 'Must be at least 1 month.'),
});

type EmiFormValues = z.infer<typeof emiFormSchema>;

interface EmiResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
}

export function EmiCalculator() {
  const [result, setResult] = useState<EmiResult | null>(null);

  const form = useForm<EmiFormValues>({
    resolver: zodResolver(emiFormSchema),
    defaultValues: {
      loanAmount: 1000000,
      interestRate: 8.5,
      tenure: 120, // 10 years
    },
  });

  function onSubmit(data: EmiFormValues) {
    const P = data.loanAmount;
    const r = data.interestRate / 100 / 12;
    const n = data.tenure;

    if (r === 0) { // Handle case where interest rate is 0
        const monthlyEmi = P / n;
        setResult({
            monthlyEmi,
            totalInterest: 0,
            totalPayment: P,
        });
        return;
    }

    const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    setResult({
      monthlyEmi: emi,
      totalInterest,
      totalPayment,
    });
  }

  const pieData = result
    ? [
        { name: 'Principal Amount', value: form.getValues().loanAmount, color: 'hsl(var(--chart-2))' },
        { name: 'Total Interest', value: result.totalInterest, color: 'hsl(var(--chart-1))' },
      ]
    : [];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interest Rate (% p.a.)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tenure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Tenure (Months)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> Calculate EMI
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
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-4xl font-bold text-primary">
                ₹{result.monthlyEmi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <Separator />
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                            ))}
                        </Pie>
                         <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            formatter={(value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
             <div className="flex justify-around">
              <div >
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]"></span>Principal Amount</p>
                <p className="text-lg font-semibold">₹{form.getValues().loanAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]"></span>Total Interest</p>
                <p className="text-lg font-semibold">₹{result.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
             <div className="!mt-8 font-bold text-lg bg-card border rounded-md p-3">
                 Total Payment: ₹{result.totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

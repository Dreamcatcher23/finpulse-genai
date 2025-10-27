'use client';

import { useState, useMemo } from 'react';
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
import { Calculator, Info } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const taxFormSchema = z.object({
  annualIncome: z.coerce.number().min(0, 'Cannot be negative.'),
  existingInvestments: z.coerce.number().min(0, 'Cannot be negative.'),
});

type TaxFormValues = z.infer<typeof taxFormSchema>;

const newRegimeSlabs = [
  { upTo: 300000, rate: 0 },
  { upTo: 600000, rate: 0.05 },
  { upTo: 900000, rate: 0.10 },
  { upTo: 1200000, rate: 0.15 },
  { upTo: 1500000, rate: 0.20 },
  { upTo: Infinity, rate: 0.30 },
];

const SECTION_80C_LIMIT = 150000;

function calculateTax(income: number) {
  let tax = 0;
  let remainingIncome = income;

  if (income <= 700000) { // Rebate under Section 87A
    return 0;
  }

  tax += Math.max(0, Math.min(income, 300000) - 0) * 0;
  tax += Math.max(0, Math.min(income, 600000) - 300000) * 0.05;
  tax += Math.max(0, Math.min(income, 900000) - 600000) * 0.10;
  tax += Math.max(0, Math.min(income, 1200000) - 900000) * 0.15;
  tax += Math.max(0, Math.min(income, 1500000) - 1200000) * 0.20;
  tax += Math.max(0, income - 1500000) * 0.30;
  
  const cess = tax * 0.04;
  return tax + cess;
}

export function TaxCalculator() {
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      annualIncome: 1000000,
      existingInvestments: 50000,
    },
  });
  
  const { annualIncome, existingInvestments } = form.watch();

  const { taxWithoutDeduction, taxWithDeduction, taxSaved, availableLimit } = useMemo(() => {
    const income = annualIncome || 0;
    const investments = existingInvestments || 0;
    
    const taxWithoutDeduction = calculateTax(income);

    const deductibleAmount = Math.min(investments, SECTION_80C_LIMIT);
    // In the new regime, 80C is not available unless you opt out of the default scheme.
    // For this calculator's purpose, we'll show the *potential* savings if it were applicable,
    // to illustrate the value of 80C investments.
    const taxableIncomeWithDeduction = Math.max(0, income - deductibleAmount);
    const taxWithDeduction = calculateTax(taxableIncomeWithDeduction);

    const taxSaved = taxWithoutDeduction - taxWithDeduction;
    const availableLimit = Math.max(0, SECTION_80C_LIMIT - investments);

    return { taxWithoutDeduction, taxWithDeduction, taxSaved, availableLimit };
  }, [annualIncome, existingInvestments]);


  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="annualIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Annual Income (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="existingInvestments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Existing 80C Investments (₹)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                 <FormMessage />
              </FormItem>
            )}
          />
           <div className="text-sm p-4 bg-muted/50 rounded-lg flex items-start gap-3">
              <Info className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                This calculator provides an illustration of potential tax savings under Section 80C. The default new tax regime does not include these deductions, but you can opt for the old regime to claim them.
              </div>
            </div>
        </form>
      </Form>
      
      <div className="flex flex-col justify-center items-center p-6 bg-muted/50 rounded-lg space-y-6">
        <div className="w-full text-center">
            <p className="text-sm text-muted-foreground">Potential Tax Saved</p>
            <p className="text-4xl font-bold text-primary">
            ₹{taxSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
        </div>
        <Separator/>
        <div className="w-full flex justify-around text-center">
            <div>
                <p className="text-sm text-muted-foreground">Available 80C Limit</p>
                <p className="text-xl font-semibold">₹{availableLimit.toLocaleString('en-IN')}</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="text-xl font-semibold">₹{annualIncome.toLocaleString('en-IN')}</p>
            </div>
        </div>
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-base">New Tax Regime Slabs (FY 2023-24)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Income Slab</TableHead>
                            <TableHead className="text-right">Tax Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell>Up to ₹3,00,000</TableCell><TableCell className="text-right">0%</TableCell></TableRow>
                        <TableRow><TableCell>₹3,00,001 - ₹6,00,000</TableCell><TableCell className="text-right">5%</TableCell></TableRow>
                        <TableRow><TableCell>₹6,00,001 - ₹9,00,000</TableCell><TableCell className="text-right">10%</TableCell></TableRow>
                        <TableRow><TableCell>₹9,00,001 - ₹12,00,000</TableCell><TableCell className="text-right">15%</TableCell></TableRow>
                        <TableRow><TableCell>₹12,00,001 - ₹15,00,000</TableCell><TableCell className="text-right">20%</TableCell></TableRow>
                        <TableRow><TableCell>Above ₹15,00,000</TableCell><TableCell className="text-right">30%</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

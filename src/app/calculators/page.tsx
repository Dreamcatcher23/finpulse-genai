import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SipCalculator } from './sip-calculator';
import { EmiCalculator } from './emi-calculator';
import { TaxCalculator } from './tax-calculator';

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Indian Finance Tools"
        description="A collection of powerful calculators to help you with your financial planning."
      />
      <Tabs defaultValue="sip" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
          <TabsTrigger value="tax">Tax Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="sip">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Systematic Investment Plan (SIP) Calculator</CardTitle>
              <CardDescription>
                Estimate the future value of your monthly investments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SipCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emi">
          <Card>
             <CardHeader>
              <CardTitle className="font-headline">Equated Monthly Installment (EMI) Calculator</CardTitle>
              <CardDescription>
                Calculate your monthly loan payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmiCalculator />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Income Tax Calculator (80C)</CardTitle>
              <CardDescription>
                Estimate your tax savings under Section 80C based on the new tax regime.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaxCalculator />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

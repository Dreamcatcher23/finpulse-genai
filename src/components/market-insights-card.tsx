
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';
import { getMarketInsights } from '@/lib/actions';

interface IndexData {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface StockData {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

interface MarketData {
  indices: IndexData[];
  trendingStocks: StockData[];
  exchangeRate: string;
  goldPrice: string;
  silverPrice: string;
}

export function MarketInsightsCard() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentKey, setContentKey] = useState(0);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await getMarketInsights() as MarketData;
      setData(result);
      setContentKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to fetch market insights", error);
      // Optionally, show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch immediately on mount
  }, []);

  const renderContent = () => {
    if (isLoading && !data) { // Show skeleton only on initial load
      return (
        <div className="space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      );
    }
    
    if (!data) {
        return <div className="text-center text-muted-foreground">Could not load market data.</div>;
    }
    
    return (
      <div className="space-y-4">
        {/* Indices */}
        <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
          {data.indices.map(index => (
            <div key={index.name} className="flex items-baseline gap-2">
              <span className="font-semibold text-muted-foreground">{index.name}</span>
              <span className="font-bold text-card-foreground">{index.value}</span>
              <span className={cn('font-semibold', index.isPositive ? 'text-green-400' : 'text-red-400')}>
                {index.change}
              </span>
            </div>
          ))}
        </div>

        {/* Trending Stocks */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Trending Stocks</h4>
          <div className="grid grid-cols-3 gap-2">
            {data.trendingStocks.map(stock => (
              <div key={stock.symbol} className={cn(
                'rounded-lg p-2 border-l-4', 
                stock.isPositive ? 'border-green-400 bg-green-400/10' : 'border-red-400 bg-red-400/10'
              )}>
                <p className="font-bold text-sm truncate">{stock.symbol}</p>
                <p className="text-xs font-semibold">{stock.price}</p>
                <p className={cn(
                  'text-xs font-bold flex items-center',
                  stock.isPositive ? 'text-green-500' : 'text-red-500'
                )}>
                  {stock.isPositive ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                  {stock.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rates */}
        <div className="grid grid-cols-3 gap-2 text-xs text-center border-t pt-4">
            <div>
                <p className="text-muted-foreground">USD/INR</p>
                <p className="font-bold text-sm">₹{data.exchangeRate}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Gold (g)</p>
                <p className="font-bold text-sm">₹{data.goldPrice}</p>
            </div>
            <div>
                <p className="text-muted-foreground">Silver (g)</p>
                <p className="font-bold text-sm">₹{data.silverPrice}</p>
            </div>
        </div>

      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>Simulated real-time financial data.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent key={contentKey} className="animate-in fade-in-50">
        {renderContent()}
      </CardContent>
    </Card>
  );
}

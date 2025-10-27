'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

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

const generateMockData = (): MarketData => {
  const formatNumber = (num: number) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
  
  const createIndex = (name: string, base: number, variance: number): IndexData => {
    const value = base + (Math.random() - 0.5) * variance;
    const change = (Math.random() - 0.45) * 2;
    return {
      name,
      value: formatNumber(value),
      change: `(${formatChange(change)})`,
      isPositive: change >= 0,
    };
  };

  const createStock = (symbol: string, base: number, variance: number): StockData => {
    const value = base + (Math.random() - 0.5) * variance;
    const change = (Math.random() - 0.5) * 4;
    return {
      symbol,
      price: `₹${formatNumber(value)}`,
      change: formatChange(change),
      isPositive: change >= 0,
    };
  };

  return {
    indices: [
      createIndex('SENSEX', 65000, 1000),
      createIndex('NIFTY 50', 19400, 300),
    ],
    trendingStocks: [
      createStock('RELIANCE', 2450, 50),
      createStock('TCS', 3400, 80),
      createStock('HDFCBANK', 1600, 40),
    ],
    exchangeRate: (82.5 + Math.random()).toFixed(2),
    goldPrice: (5900 + Math.random() * 100).toFixed(2),
    silverPrice: (72 + Math.random() * 5).toFixed(2),
  };
};


export function MarketInsightsCard() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentKey, setContentKey] = useState(0);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setIsLoading(false);
      setContentKey(prev => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading || !data) {
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
            <CardDescription>Real-time financial data.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </div>
      </CardHeader>
      <CardContent key={contentKey}>
        {renderContent()}
      </CardContent>
    </Card>
  );
}

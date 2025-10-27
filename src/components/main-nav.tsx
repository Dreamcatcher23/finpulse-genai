'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BrainCircuit,
  BarChart,
  Settings,
  Target,
  Calculator,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/planner', label: 'Planner', icon: Target },
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/summarizer', label: 'Summarizer', icon: FileText },
  { href: '/quiz', label: 'Quiz', icon: BrainCircuit },
  { href: '/cost', label: 'Cost Management', icon: BarChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href) && (href !== '/' || pathname === '/');
          if (isMobile) {
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  isActive && 'bg-muted text-primary'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          }
          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}

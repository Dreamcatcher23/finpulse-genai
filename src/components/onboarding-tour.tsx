'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTour } from '@/hooks/use-tour';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TourStep {
  targetId: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  tourId: string;
  steps: TourStep[];
}

export function OnboardingTour({ tourId, steps }: OnboardingTourProps) {
  const { isTourOpen, currentStep, nextStep, skipTour } = useTour(tourId, steps.length);
  const [highlightStyle, setHighlightStyle] = useState({});
  const [tooltipStyle, setTooltipStyle] = useState({});
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const currentStepData = steps[currentStep];

  const updatePositions = useCallback(() => {
    if (!isTourOpen || !currentStepData) return;

    const targetElement = document.getElementById(currentStepData.targetId);
    if (!targetElement) {
      skipTour();
      return;
    }
    
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();

    setHighlightStyle({
      width: `${targetRect.width + 16}px`,
      height: `${targetRect.height + 16}px`,
      top: `${targetRect.top - 8}px`,
      left: `${targetRect.left - 8}px`,
    });

    let top, left;
    const placement = currentStepData.placement || 'bottom';

    switch (placement) {
      case 'top':
        top = targetRect.top - (tooltipRect?.height || 0) - 10;
        left = targetRect.left + targetRect.width / 2 - (tooltipRect?.width || 0) / 2;
        break;
      case 'right':
        top = targetRect.top + targetRect.height / 2 - (tooltipRect?.height || 0) / 2;
        left = targetRect.right + 10;
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2 - (tooltipRect?.height || 0) / 2;
        left = targetRect.left - (tooltipRect?.width || 0) - 10;
        break;
      case 'center':
        top = window.innerHeight / 2 - (tooltipRect?.height || 0) / 2;
        left = window.innerWidth / 2 - (tooltipRect?.width || 0) / 2;
        break;
      case 'bottom':
      default:
        top = targetRect.bottom + 10;
        left = targetRect.left + targetRect.width / 2 - (tooltipRect?.width || 0) / 2;
        break;
    }
    
    // Boundary checks
    if(tooltipRect) {
        if(top < 10) top = 10;
        if(left < 10) left = 10;
        if(left + tooltipRect.width > window.innerWidth - 10) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        if(top + tooltipRect.height > window.innerHeight - 10) {
            top = window.innerHeight - tooltipRect.height - 10;
        }
    }


    setTooltipStyle({ top: `${top}px`, left: `${left}px` });
  }, [isTourOpen, currentStepData, skipTour]);

  useEffect(() => {
    if (isTourOpen) {
      const timer = setTimeout(updatePositions, 100);
      window.addEventListener('resize', updatePositions);
      window.addEventListener('scroll', updatePositions);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePositions);
        window.removeEventListener('scroll', updatePositions);
      };
    }
  }, [isTourOpen, updatePositions]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isTourOpen) return;
        if (e.key === 'Escape') {
            skipTour();
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            nextStep();
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, nextStep, skipTour]);

  if (!isTourOpen || !currentStepData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/70 animate-in fade-in-0" onClick={skipTour}></div>
      <div
        className="absolute bg-background transition-all duration-300 rounded-lg"
        style={highlightStyle}
      ></div>
      <div
        ref={tooltipRef}
        className="absolute z-10 w-80 rounded-lg border bg-card text-card-foreground shadow-xl animate-in fade-in-0 zoom-in-95"
        style={tooltipStyle}
      >
        <div className="p-4">
            <h3 className="font-headline text-lg font-semibold text-primary">{currentStepData.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{currentStepData.content}</p>
        </div>
        <div className="flex items-center justify-between p-4 border-t">
          <Button variant="ghost" size="sm" onClick={skipTour}>Skip Tour</Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{currentStep + 1} / {steps.length}</span>
            <Button size="sm" onClick={nextStep}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

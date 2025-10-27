'use client';

import { useState, useEffect, useCallback } from 'react';

export function useTour(tourId: string, totalSteps?: number) {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const wasTourTaken = useCallback(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem(tourId) === 'completed';
  }, [tourId]);

  const finishTour = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(tourId, 'completed');
    setIsTourOpen(false);
    setCurrentStep(0);
  }, [tourId]);

  const startTour = useCallback((force = false) => {
    if (typeof window === 'undefined') return;
    if (force) {
        localStorage.removeItem(tourId);
    }
    setCurrentStep(0);
    setIsTourOpen(true);
  }, [tourId]);

  const skipTour = useCallback(() => {
    finishTour();
  }, [finishTour]);

  const nextStep = useCallback(() => {
    if (totalSteps && currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishTour();
    }
  }, [currentStep, totalSteps, finishTour]);

  return {
    isTourOpen,
    currentStep,
    wasTourTaken,
    startTour,
    nextStep,
    skipTour,
    setTourOpen: setIsTourOpen,
  };
}

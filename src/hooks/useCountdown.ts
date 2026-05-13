import { useState, useEffect, useCallback } from 'react';

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  urgency: 'critical' | 'warning' | 'safe' | 'ended';
  isEnded: boolean;
}

export function useCountdown(targetDate: string): CountdownResult {
  const calculateTimeLeft = useCallback((): CountdownResult => {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, urgency: 'ended', isEnded: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let urgency: 'critical' | 'warning' | 'safe';
    if (days < 3) {
      urgency = 'critical';
    } else if (days <= 7) {
      urgency = 'warning';
    } else {
      urgency = 'safe';
    }

    return { days, hours, minutes, seconds, urgency, isEnded: false };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

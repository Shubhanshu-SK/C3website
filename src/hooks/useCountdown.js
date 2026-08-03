import { useState, useEffect } from 'react';

export default function useCountdown(targetDateString) {
  const calculateTimeLeft = () => {
    const target = new Date(targetDateString).getTime();
    const now = Date.now();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    let secs = Math.floor(difference / 1000);
    const days = Math.floor(secs / 86400);
    secs %= 86400;
    
    const hours = Math.floor(secs / 3600);
    secs %= 3600;
    
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;

    return { days, hours, minutes, seconds, expired: false };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateString]);

  return timeLeft;
}

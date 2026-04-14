import { useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';

type TypographyProps = Record<string, unknown>;

interface AnimatedCounterProps extends Omit<TypographyProps, 'children'> {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  decimals = 0,
  duration = 1200,
  prefix = '',
  suffix = '',
  ...typographyProps
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    startValueRef.current = display;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValueRef.current + (value - startValueRef.current) * eased;
      setDisplay(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration, display]);

  return (
    <Typography {...typographyProps}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </Typography>
  );
}

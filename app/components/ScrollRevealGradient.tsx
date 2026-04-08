"use client";

import { useEffect, useRef, useState } from 'react';

interface ScrollRevealGradientProps {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export default function ScrollRevealGradient({
  children,
  className = '',
  rootMargin = '0px 0px -10% 0px',
  threshold = 0.15,
  once = true,
}: ScrollRevealGradientProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mql.matches) {
      // 无动画场景：直接显示
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { root: null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return (
    <div ref={ref} className={`reveal-gradient ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

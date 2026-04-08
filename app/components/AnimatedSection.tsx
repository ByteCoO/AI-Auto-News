'use client';

import React, { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in-left' | 'fade-in-right' | 'scale-in' | 'rotate-in' | 'reveal-on-scroll';
  delay?: number;
  className?: string;
  stagger?: boolean;
  grid?: boolean;
  parallax?: boolean;
  parallaxSpeed?: number;
  mouseParallax?: boolean;
  mouseSpeed?: number;
}

export default function AnimatedSection({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
  stagger = false,
  grid = false,
  parallax = false,
  parallaxSpeed = 0.5,
  mouseParallax = false,
  mouseSpeed = 0.1
}: AnimatedSectionProps) {
  const classes = [
    animation,
    stagger ? 'stagger-container' : '',
    grid ? 'grid-reveal-container' : '',
    parallax ? 'parallax-bg' : '',
    mouseParallax ? 'mouse-parallax' : '',
    className
  ].filter(Boolean).join(' ');

  const style = {
    animationDelay: delay ? `${delay}s` : undefined,
    '--parallax-speed': parallaxSpeed,
    '--mouse-speed': mouseSpeed,
  };

  return (
    <div 
      className={classes} 
      style={style}
      data-speed={parallaxSpeed}
      data-mouse-speed={mouseSpeed}
    >
      {stagger ? (
        React.Children.map(children, (child, index) => (
          <div className="stagger-child" key={index}>
            {child}
          </div>
        ))
      ) : grid ? (
        React.Children.map(children, (child, index) => (
          <div className="grid-reveal-child" key={index}>
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
}

// Specialized components for common use cases
export function AnimatedCard({ 
  children, 
  className = '', 
  animation = 'scale-in',
  delay = 0,
  hover = true 
}: {
  children: ReactNode;
  className?: string;
  animation?: 'scale-in' | 'fade-up' | 'rotate-in';
  delay?: number;
  hover?: boolean;
}) {
  return (
    <AnimatedSection 
      animation={animation} 
      delay={delay}
      className={`card ${hover ? 'micro-bounce' : ''} ${className}`}
    >
      {children}
    </AnimatedSection>
  );
}

export function AnimatedGrid({ 
  children, 
  className = '',
  cols = 3 
}: {
  children: ReactNode;
  className?: string;
  cols?: number;
}) {
  return (
    <AnimatedSection 
      animation="fade-up" 
      grid={true}
      className={`dashboard-grid ${cols === 3 ? 'dashboard-grid-3' : cols === 2 ? 'dashboard-grid-2' : ''} ${className}`}
    >
      {children}
    </AnimatedSection>
  );
}

export function AnimatedText({ 
  children, 
  className = '',
  stagger = true 
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  if (typeof children === 'string') {
    const lines = children.split('\n');
    return (
      <div className={`text-reveal-container ${className}`}>
        {lines.map((line, index) => (
          <div key={index} className="text-reveal-line">
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <AnimatedSection 
      animation="fade-up" 
      stagger={stagger}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

export function AnimatedCounter({ 
  target, 
  suffix = '',
  className = '' 
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <span 
      className={`counter-animate ${className}`}
      data-target={target}
    >
      0{suffix}
    </span>
  );
}

export function ParallaxBackground({ 
  children, 
  speed = 0.5,
  className = '' 
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div 
      className={`parallax-bg ${className}`}
      data-speed={speed}
    >
      {children}
    </div>
  );
}
'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    // Enhanced observer options for different animation types
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    // Main scroll reveal observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Add visible class for basic reveal
          element.classList.add('visible');
          
          // Handle staggered children animations
          const staggerChildren = element.querySelectorAll('.stagger-child');
          staggerChildren.forEach((child, index) => {
            setTimeout(() => {
              (child as HTMLElement).classList.add('visible');
            }, index * 150); // Slightly longer delay for smoother effect
          });

          // Handle cascading grid animations
          const gridChildren = element.querySelectorAll('.grid-reveal-child');
          gridChildren.forEach((child, index) => {
            setTimeout(() => {
              (child as HTMLElement).classList.add('visible');
            }, index * 80);
          });

          // Handle progressive text reveals
          const textLines = element.querySelectorAll('.text-reveal-line');
          textLines.forEach((line, index) => {
            setTimeout(() => {
              (line as HTMLElement).classList.add('visible');
            }, index * 200);
          });

          // Trigger counter animations for metrics
          const counters = element.querySelectorAll('.counter-animate');
          counters.forEach((counter) => {
            animateCounter(counter as HTMLElement);
          });
        }
      });
    }, observerOptions);

    // Parallax effect observer for background elements
    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.classList.add('parallax-active');
          
          // Add scroll listener for continuous parallax
          window.addEventListener('scroll', () => handleParallax(element));
        }
      });
    }, { threshold: 0 });

    // Counter animation function
    const animateCounter = (element: HTMLElement) => {
      const target = parseInt(element.getAttribute('data-target') || '0');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          element.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      };
      
      updateCounter();
    };

    // Parallax scroll handler
    const handleParallax = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const speed = parseFloat(element.getAttribute('data-speed') || '0.5');
      const yPos = -(rect.top * speed);
      element.style.transform = `translateY(${yPos}px)`;
    };

    // Progressive image loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          if (src) {
            img.src = src;
            img.classList.add('image-loaded');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { threshold: 0.1 });

    // Initialize observers
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .fade-up, .fade-in-left, .fade-in-right, .scale-in, .rotate-in');
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    const lazyImages = document.querySelectorAll('img[data-src]');

    revealElements.forEach((el) => observer.observe(el));
    parallaxElements.forEach((el) => parallaxObserver.observe(el));
    lazyImages.forEach((el) => imageObserver.observe(el));

    // Mouse movement parallax for hero elements
    const handleMouseParallax = (e: MouseEvent) => {
      const heroElements = document.querySelectorAll('.mouse-parallax');
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      heroElements.forEach((element) => {
        const speed = parseFloat((element as HTMLElement).getAttribute('data-mouse-speed') || '0.1');
        const x = (clientX - centerX) * speed;
        const y = (clientY - centerY) * speed;
        (element as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      });
    };

    // Add mouse parallax to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseParallax);
    }

    // Cleanup function
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      parallaxElements.forEach((el) => parallaxObserver.unobserve(el));
      lazyImages.forEach((el) => imageObserver.unobserve(el));
      
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseParallax);
      }
      
      window.removeEventListener('scroll', () => {});
    };
  }, []);

  return null;
}
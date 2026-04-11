'use client';

import { useState, useRef, useEffect } from 'react';

interface ExpandableTextProps {
  text: string;
  className?: string;
  maxLines?: number;
}

export default function ExpandableText({ text, className = "", maxLines = 3 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  const checkOverflow = () => {
    const element = textRef.current;
    if (element) {
      const isOverflowing = element.scrollHeight > element.clientHeight;
      setShouldShowButton(isOverflowing);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text, isExpanded]);

  return (
    <div className="relative flex flex-col items-center">
      <p
        ref={textRef}
        className={`transition-all duration-300 w-full ${className} ${
          !isExpanded ? "overflow-hidden" : ""
        }`}
        style={!isExpanded ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        } : {}}
      >
        {text}
      </p>
      {shouldShowButton && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="mt-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

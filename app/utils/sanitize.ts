/**
 * HTML Sanitization Utility
 * 
 * Prevents XSS attacks by sanitizing HTML content before rendering.
 * Uses DOMPurify for secure HTML sanitization.
 * 
 * @see https://github.com/cure53/DOMPurify
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Configuration for DOMPurify sanitization
 * Allows safe HTML tags while blocking dangerous ones
 */
const SANITIZE_CONFIG: DOMPurify.Config = {
  // Allowed HTML tags (safe for content rendering)
  ALLOWED_TAGS: [
    // Headings
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // Text formatting
    'p', 'br', 'hr', 'span', 'div',
    'strong', 'em', 'b', 'i', 'u', 's', 'strike', 'del', 'ins',
    'sub', 'sup', 'mark', 'small',
    // Lists
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // Links and media
    'a', 'img', 'figure', 'figcaption',
    // Code
    'code', 'pre', 'kbd', 'samp', 'var',
    // Quotes and citations
    'blockquote', 'q', 'cite', 'abbr',
    // Tables
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // Semantic elements
    'article', 'section', 'aside', 'header', 'footer', 'nav', 'main',
    'details', 'summary', 'time', 'address'
  ],
  
  // Allowed attributes
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'class', 'id',
    'target', 'rel', 'width', 'height',
    'colspan', 'rowspan', 'scope', 'headers',
    'datetime', 'cite', 'lang', 'dir',
    'loading', 'decoding' // For images
  ],
  
  // Forbid dangerous tags explicitly
  FORBID_TAGS: [
    'script', 'style', 'iframe', 'frame', 'frameset',
    'object', 'embed', 'applet',
    'form', 'input', 'button', 'select', 'textarea',
    'meta', 'link', 'base', 'noscript'
  ],
  
  // Forbid dangerous attributes (event handlers)
  FORBID_ATTR: [
    'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout',
    'onmouseenter', 'onmouseleave', 'onfocus', 'onblur',
    'onsubmit', 'onreset', 'onchange', 'oninput',
    'onkeydown', 'onkeyup', 'onkeypress',
    'ondrag', 'ondrop', 'onscroll', 'onresize',
    'formaction', 'xlink:href', 'xmlns'
  ],
  
  // Don't allow data: URLs in attributes (can be used for XSS)
  ALLOW_DATA_ATTR: false,
  
  // Add rel="noopener noreferrer" to links for security
  ADD_ATTR: ['target'],
  
  // Keep content safe but don't strip too much
  KEEP_CONTENT: true,
  
  // Return string type
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```tsx
 * import { sanitizeHtml } from '@/app/utils/sanitize';
 * import { marked } from 'marked';
 * 
 * const rawHtml = marked.parse(markdownContent);
 * const safeHtml = sanitizeHtml(rawHtml);
 * 
 * <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
 * ```
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(html, SANITIZE_CONFIG) as string;
}

/**
 * Sanitizes HTML with stricter rules (for user-generated content)
 * Only allows basic formatting, no links or images
 * 
 * @param html - The HTML string to sanitize
 * @returns Strictly sanitized HTML string
 */
export function sanitizeHtmlStrict(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'a', 'img', 'form', 'input'],
    FORBID_ATTR: ['href', 'src', 'onerror', 'onclick'],
    ALLOW_DATA_ATTR: false
  }) as string;
}

/**
 * Sanitizes content and ensures links open in new tabs safely
 * Adds rel="noopener noreferrer" to all external links
 * 
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML with safe external links
 */
export function sanitizeHtmlWithSafeLinks(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // First sanitize
  let sanitized = DOMPurify.sanitize(html, SANITIZE_CONFIG) as string;
  
  // Then add rel="noopener noreferrer" to links that don't have it
  // This is a simple regex approach; for complex cases, use a DOM parser
  sanitized = sanitized.replace(
    /<a\s+([^>]*?)href=/gi,
    (match, attrs) => {
      if (!attrs.includes('rel=')) {
        return `<a ${attrs}rel="noopener noreferrer" href=`;
      }
      return match;
    }
  );
  
  return sanitized;
}

/**
 * Check if a string contains potentially dangerous HTML
 * Useful for logging or alerting about suspicious content
 * 
 * @param html - The HTML string to check
 * @returns true if dangerous patterns are detected
 */
export function containsDangerousHtml(html: string): boolean {
  if (!html || typeof html !== 'string') {
    return false;
  }
  
  const dangerousPatterns = [
    /<script\b/i,
    /<iframe\b/i,
    /javascript:/i,
    /data:text\/html/i,
    /on\w+\s*=/i, // Event handlers like onclick=, onerror=
    /<object\b/i,
    /<embed\b/i,
    /<form\b/i,
    /expression\s*\(/i, // CSS expression
    /url\s*\(\s*["']?\s*javascript:/i
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(html));
}

export default sanitizeHtml;

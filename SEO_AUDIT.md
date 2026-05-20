# SEO Audit Report - Game Visioning / GameVerse

**Date:** 2026-05-20
**Domain:** https://visionong.dpdns.org
**Framework:** Next.js 14.1.0 (App Router)
**Deployment:** Vercel (standard server mode, NOT static export)

---

## Executive Summary

The site has **23 critical/important SEO issues** preventing proper Google indexing. The most severe problems are: duplicate canonical tags pointing all pages to the root URL, client-only rendering on most pages (Googlebot may not execute JS), placeholder verification codes, and missing per-page metadata.

---

## CRITICAL Issues (Blocking Indexing)

### 1. Duplicate Canonical Tags - ALL pages point to root URL
- **File:** `app/layout.tsx:123`
- **Issue:** A hardcoded `<link rel="canonical" href="https://visionong.dpdns.org" />` in the `<head>` JSX overrides the metadata-based canonical for EVERY page. This tells Google that `/trends`, `/ideas`, `/about` etc. are all the same page as `/`.
- **Impact:** Google will likely only index the homepage and ignore/drop all other pages.
- **Severity:** CRITICAL

### 2. Client-Only Pages - No SSR Content for Googlebot
- **Files:** `app/about/page.tsx`, `app/ideas/page.tsx`, `app/goldmine/page.tsx`, `app/price/page.tsx`, `app/feedback/page.tsx`, `app/trends/page.tsx`
- **Issue:** These pages use `'use client'` and render entirely on the client. Googlebot's rendering queue may not execute all JS, resulting in blank pages being indexed.
- **Impact:** Pages may appear empty in Google's index or not be indexed at all.
- **Severity:** CRITICAL

### 3. Placeholder Google Site Verification
- **Files:** `app/layout.tsx:126`, `app/layout.tsx:27`
- **Issue:** `google-site-verification` value is `"your-google-site-verification-code-here"` - a placeholder. Site cannot be verified in Google Search Console.
- **Impact:** Cannot submit sitemap, cannot monitor indexing status.
- **Severity:** CRITICAL

### 4. Missing Per-Page Metadata
- **Files:** All pages except the root layout
- **Issue:** No page exports its own `metadata` or `generateMetadata`. The title template `%s | Game Visioning` will render as just "Game Visioning" on every page since no page sets a title.
- **Impact:** All pages have identical titles in search results - poor CTR and confusing for users.
- **Severity:** CRITICAL

---

## HIGH Issues (Significantly Impacting SEO)

### 5. robots.ts References Non-Existent Sitemap
- **File:** `app/robots.ts:21-23`
- **Issue:** References `https://visionong.dpdns.org/news-sitemap.xml` which doesn't exist. Returns 404.
- **Impact:** Google Search Console will report sitemap errors.
- **Severity:** HIGH

### 6. Placeholder Verification Codes (Bing, Yandex, Pinterest, Facebook)
- **File:** `app/layout.tsx:127-130`
- **Issue:** All verification meta tags contain placeholder values.
- **Impact:** Cannot verify on other search engines.
- **Severity:** HIGH

### 7. Missing og-image.jpg
- **File:** `app/layout.tsx:45`
- **Issue:** OpenGraph metadata references `/og-image.jpg` but this file doesn't exist. Dynamic OG images exist via `opengraph-image.tsx` but the static reference is broken.
- **Impact:** Social sharing may show broken images.
- **Severity:** HIGH

### 8. Brand Inconsistency
- **Files:** Throughout the codebase
- **Issue:** Metadata uses "Game Visioning", Navbar/Footer/page content uses "GameVerse", domain is "visionong.dpdns.org". Three different brand identities.
- **Impact:** Confuses search engines about entity identity, dilutes brand signals.
- **Severity:** HIGH

### 9. 404 Page Links to Non-Existent Route
- **File:** `app/not-found.tsx:15-20`
- **Issue:** Links to `/news` which doesn't exist. Should link to `/` or `/trends`.
- **Impact:** Users hitting 404 get another dead end.
- **Severity:** HIGH

### 10. Missing RSS Feed
- **File:** `app/layout.tsx:124`
- **Issue:** References `/rss.xml` but no RSS feed exists.
- **Impact:** Broken link in head, potential crawl error.
- **Severity:** HIGH

---

## MEDIUM Issues (Affecting SEO Quality)

### 11. Homepage Uses force-dynamic Unnecessarily
- **File:** `app/page.tsx:3-4`
- **Issue:** `export const dynamic = 'force-dynamic'` and `revalidate = 0` on a page with no dynamic data. This forces SSR on every request for static content.
- **Impact:** Slower page loads, unnecessary server load.
- **Severity:** MEDIUM

### 12. Homepage Has Duplicate Footer
- **File:** `app/page.tsx:270-273`
- **Issue:** Homepage renders its own `<footer>` in addition to the `<Footer />` component from the layout. Two footers appear.
- **Impact:** Poor user experience, duplicate content in HTML.
- **Severity:** MEDIUM

### 13. Login Page in Sitemap
- **File:** `app/sitemap.ts` (missing `/login`)
- **Issue:** `/login` is NOT in the sitemap (good), but it IS linked from the Navbar and Footer. It's a thin page with no real content.
- **Impact:** Minor - login pages shouldn't be indexed anyway.
- **Severity:** LOW (already handled correctly)

### 14. Deprecated Pages Still in Project
- **Files:** `deprecated_pages/` directory
- **Issue:** Old dashboard and reddit-opportunities pages still exist. Could confuse developers or accidentally get deployed.
- **Impact:** Potential for stale content to be accessible.
- **Severity:** MEDIUM

### 15. Unused next-seo.config.js
- **File:** `next-seo.config.js`
- **Issue:** Configures `next-seo` package which isn't installed or imported anywhere.
- **Impact:** Dead code, confusing for developers.
- **Severity:** LOW

### 16. Old robots.txt in Public
- **File:** `public/robots.txt.old`
- **Issue:** Superseded by `app/robots.ts` but still present.
- **Impact:** Could accidentally be served if moved/renamed.
- **Severity:** LOW

### 17. No Structured Data / Schema Markup
- **Issue:** No JSON-LD structured data on any page. No Organization, WebSite, Article, or BreadcrumbList schemas.
- **Impact:** Missing rich snippets in search results.
- **Severity:** MEDIUM

### 18. Missing apple-touch-icon and Favicons
- **File:** `app/layout.tsx:138-141`
- **Issue:** Apple-touch-icon and multi-size favicons are commented out with "create the file first" note.
- **Impact:** Missing icons on mobile bookmarks, PWA install prompts.
- **Severity:** MEDIUM

### 19. lead-intelligence Uses revalidate=0
- **File:** `app/lead-intelligence/page.tsx:7`
- **Issue:** `revalidate = 0` means no caching at all. Data is fetched fresh on every request.
- **Impact:** Slow page loads, high server load.
- **Severity:** MEDIUM

---

## LOW Issues (Minor Improvements)

### 20. Mixed Case File Extensions in R-data
- **Files:** `public/R-data/8.JSON` vs others like `1.json`
- **Issue:** Inconsistent file extension casing.
- **Impact:** Potential case-sensitivity issues on Linux deployments.
- **Severity:** LOW

### 21. Supabase Client Instantiation Duplication
- **Files:** `lib/supabaseClient.ts`, `app/lib/supabase.ts`, `app/lead-intelligence/utils.ts`
- **Issue:** Three separate Supabase client files.
- **Impact:** Code maintainability.
- **Severity:** LOW

### 22. No middleware.ts for Request Handling
- **Issue:** No middleware for redirects, auth checks, or request modification.
- **Impact:** Missing opportunities for edge-level SEO optimizations.
- **Severity:** LOW

### 23. Google Site Verification HTML File is Placeholder
- **File:** `public/google-site-verification.html`
- **Issue:** Contains placeholder content.
- **Impact:** Cannot verify via HTML file method.
- **Severity:** MEDIUM

---

## Summary Table

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 4 | Fixing now |
| HIGH | 6 | Fixing now |
| MEDIUM | 7 | Fixing where safe |
| LOW | 6 | Documented |
| **Total** | **23** | |

├── .env.local                # Local environment variables (Supabase keys, Base URL - NOT committed to Git)
├── .gitignore                # Specifies intentionally untracked files that Git should ignore
├── next.config.js / .ts      # Next.js configuration file
├── package.json              # Project metadata, dependencies, and scripts
├── package-lock.json         # Records exact versions of dependencies
├── postcss.config.js / .mjs  # PostCSS configuration (used by Tailwind CSS)
├── tailwind.config.js / .ts  # Tailwind CSS configuration file
├── tsconfig.json             # TypeScript configuration file
├── README.md                 # Project overview, setup instructions
└── PROJECT_STRUCTURE.md      # This file
\`\`\`

## Key File Descriptions

### \`app/\` Directory

*   **\`layout.tsx\`**: Defines the root HTML structure (<html>, <body> tags) and wraps all pages. It includes global providers like \`ThemeProvider\`, \`AuthProvider\`, and \`FTNewsProvider\`.
*   **\`page.tsx\`**: The main homepage component. It's a Server Component, fetches initial data, and renders key UI sections like \`MultiSourceNews\` and \`LatestNews\`.
*   **\`app/components/\`**: Contains reusable UI elements. For example:
    *   \`LatestNews.tsx\`: Displays a list of news, supports server-side initial data and client-side "load more".
    *   \`MultiSourceNews.tsx\`: Displays news from multiple sources in a card layout.
    *   \`Navbar.tsx\`, \`Footer.tsx\`: Common site navigation and footer elements.
*   **\`app/contexts/\`**: Manages global state.
    *   \`AuthContext.tsx\`: Handles user authentication logic and state.
    *   \`FTNewsContext.tsx\`: Manages fetching and state for Financial Times news articles.
*   **\`app/lib/supabase.ts\`**: Initializes and exports the Supabase client, used for database interactions and authentication.
*   **\`app/api/\`**: Defines server-side API routes. For example, \`app/api/news/route.ts\` handles requests for news data, fetching it from Supabase.
*   **\`app/ft-news/[id]/page.tsx\`**: A dynamic Server Component that renders individual news articles. It fetches article data server-side and generates dynamic metadata for SEO.
*   **\`app/sitemap.ts\`**: Dynamically generates the \`sitemap.xml\` file, crucial for SEO, by fetching article data from Supabase.

### Configuration Files (Root Directory)*   **\`.env.local\`**: **Crucial for local development.** Stores sensitive information like Supabase API keys (\`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`) and the site's base URL (\`NEXT_PUBLIC_BASE_URL\`). **This file should not be committed to version control.**
*   **\`next.config.js\` (or \`.ts\`)**: Configures Next.js features, like image optimization, redirects, etc.
*   **\`tailwind.config.js\` (or \`.ts\`)**: Configures Tailwind CSS, including custom themes, plugins, and content paths.
*   **\`tsconfig.json\`**: Configures the TypeScript compiler options for the project.
*   **\`package.json\`**: Lists project dependencies, development dependencies, and scripts for building, running, and linting the application (e.g., \`npm run dev\`, \`npm run build\`).

## Development Conventions & Notes

*   **Server Components vs. Client Components:** The project utilizes the Next.js App Router paradigm. Server Components (\`async function Page() {}\`) are used for fetching data server-side and rendering static content, which is excellent for SEO and initial page load. Client Components (\`'use client';\`) are used for interactive UI elements and client-side state management.
*   **Environment Variables:** All sensitive keys and environment-specific configurations should be managed through environment variables (e.g., \`.env.local\` for local, and platform-specific settings for deployment).
*   **Absolute Imports:** The project uses absolute imports (e.g., \`import X from 'app/components/X'\`) which can be configured in \`tsconfig.json\`. This is generally preferred over deep relative imports (\`../../components/X\`).
*   **SEO:** Significant effort has been made to optimize SEO, including server-rendering critical content, dynamic metadata generation (\`generateMetadata\`), JSON-LD structured data, and a dynamic sitemap.
*   **Supabase Integration:** Supabase is used for backend services, primarily database storage (e.g., \`FT_articles\`, \`articles_summary\` tables) and user authentication.

This structure should provide a good starting point for navigating and contributing to the project.### Directory Explanations:

*   **`app/`**: This is the core directory for the Next.js App Router.
    *   **`page.tsx`**: Defines the UI for the `/` route. It's a Server Component, meaning it fetches data and renders on the server.
    *   **`layout.tsx`**: (Presumed) Defines the root layout shared across pages (e.g., header, footer, global styles).
    *   **`components/`**: Contains reusable React components.
        *   `MultiSourceNews.tsx`: A key component responsible for rendering the news items from various sources passed to it as props.
    *   **`api/`**: This directory hosts server-side API route handlers.
        *   `news/route.js` (or `.ts`): This specific route is crucial. It acts as a backend endpoint (`/api/news`) that `app/page.tsx` calls (server-side) to fetch all aggregated news data. This `route.js` file itself is responsible for fetching data from the actual external news sources (e.g., Bloomberg, FT APIs, or other data providers), processing it, and returning a unified JSON response.

*   **`public/`**: Stores static assets like images, fonts, etc., that are served directly.

## 4. `app/api/` Deep Dive

The `app/api/` directory follows Next.js conventions for creating API endpoints.

*   **`app/api/news/route.js` (or `route.ts`)**:
    *   **Purpose**: To provide a unified backend endpoint for all news data.
    *   **Functionality**:
        1.  It likely contains functions to fetch data from various external news APIs or sources (e.g., Bloomberg, Financial Times, Zaobao, WallStreetCN, ITHome).
        2.  It aggregates the data from these different sources into a common format.
        3.  It handles requests (typically GET) to `/api/news`.
        4.  It returns a JSON response containing the aggregated list of news items.
    *   **Execution**: This code runs exclusively on the server-side.
    *   **Client Interaction**: While it's an API route, in this project's current structure (`app/page.tsx` being a Server Component), the primary consumer of `/api/news` is `app/page.tsx` itself, making a server-to-server request during its rendering phase. Client-side components *could* also fetch from this endpoint if needed (e.g., for updates without a full page reload).

## 5. Data Flow

1.  A user requests the homepage (`/`).
2.  Next.js invokes the Server Component `app/page.tsx` on the server.
3.  `app/page.tsx` calls its `getGroupedNewsData()` function.
4.  `getGroupedNewsData()` makes a `fetch` request (still on the server) to the `/api/news` endpoint (which is handled by `app/api/news/route.js`).
5.  `app/api/news/route.js` executes:
    *   It fetches raw data from various configured external news sources (e.g., calls to Bloomberg's API, FT's API, scrapes a website, or reads from a database).
    *   It standardizes and aggregates this raw data.
    *   It sends a JSON response back to the `fetch` call made in `getGroupedNewsData()`.
6.  `getGroupedNewsData()` receives the aggregated news, processes it further (e.g., sorts, groups by source as defined in `sourceConfig`), and prepares it for the `MultiSourceNews` component.
7.  `app/page.tsx` renders itself and the `MultiSourceNews` component (with the fetched data as props) into HTML.
8.  The fully rendered HTML (or an initial static shell with data for hydration) is sent to the user's browser.
9.  The `MultiSourceNews` component in the browser then displays the news.

**Key Point:** The actual fetching from external news providers (like Bloomberg) happens within `app/api/news/route.js` on the server. This is why these specific external requests are not visible in the browser's network console; the browser only sees the data that `app/page.tsx` has already prepared.

## 6. Key Files for Understanding

*   **`app/page.tsx`**: Understands how initial data is fetched and passed to UI components.
*   **`app/api/news/route.js` (or `route.ts`)**: The heart of the data aggregation logic. This is where to look for how specific news sources are integrated.
*   **`app/components/MultiSourceNews.tsx`**: Shows how the aggregated news data is presented to the user.

## 7. Notes for AI/LLM

*   The project uses Next.js App Router features, including Server Components.
*   Data fetching for the main page is primarily server-side.
*   The `/api/news` route is a crucial backend aggregation layer.
*   When analyzing data flow, differentiate between server-side fetches (e.g., `page.tsx` -> `/api/news`, and `/api/news` -> external sources) and client-side interactions.
*   The term "Bloomberg data" or "FT data" refers to news items sourced from these providers, which are fetched and processed by `app/api/news/route.js`.

This structure aims for a clean separation of concerns, with data fetching and aggregation handled on the server, and React components focused on rendering the UI.
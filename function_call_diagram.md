```mermaid
graph TD
    %% Subgraph for lib/supabaseClient.ts
    subgraph ClientLib [lib/supabaseClient.ts]
        LSC1["createClient() from @supabase/supabase-js"]
        LSC_export["export const supabase (client instance)"]
        LSC1 --> LSC_export
    end

    %% Subgraph for app/layout.tsx
    subgraph ServerLayout [app/layout.tsx]
        RL_RootLayout["RootLayout (async function)"]
        RL_cookies["cookies() (from next/headers)"]
        RL_createServerClient["createServerClient() (from @supabase/ssr)"]
        RL_supabaseAuthGetUser["supabase.auth.getUser()"]
        RL_childrenRender["Renders {children}"]
        
        RL_RootLayout --> RL_cookies
        RL_cookies --> RL_createServerClient
        RL_createServerClient --> RL_supabaseAuthGetUser
        RL_RootLayout --> RL_childrenRender

        RL_RootLayout -.-> Comp_ThemeProvider["<ThemeProvider>"]
        RL_RootLayout -.-> Comp_AuthProvider["<AuthProvider>"]
        RL_RootLayout -.-> Comp_FTNewsProvider["<FTNewsProvider>"]
        RL_RootLayout -.-> Comp_Navbar["<Navbar> (from ./components)"]
        RL_RootLayout -.-> Comp_Footer["<Footer> (from ./components)"]
    end

    %% Subgraph for app/page.tsx
    subgraph AppPage [app/page.tsx]
        HP_Home["Home (async function - Page)"]
        HP_PromiseAll["Promise.all()"]
        HP_getGroupedNewsData["getGroupedNewsData()"]
        HP_getInitialLatestNewsData["getInitialLatestNewsData()"]
        
        HP_Home --> HP_PromiseAll
        HP_PromiseAll --> HP_getGroupedNewsData
        HP_PromiseAll --> HP_getInitialLatestNewsData

        HP_getGroupedNewsData --> F_fetch_multi["fetch('/api/news?sourceType=multi')"]
        HP_getGroupedNewsData --> F_formatPublicationTime["formatPublicationTime()"]
        
        HP_getInitialLatestNewsData --> F_fetch_latest["fetch('/api/news?sourceType=latest')"]
        
        F_formatPublicationTime_internals["formatPublicationTime() internals (new Date(), padStart(), etc.)"]
        F_formatPublicationTime --> F_formatPublicationTime_internals

        HP_Home -.-> Comp_MultiSourceNews["<MultiSourceNews> (from ./components)"]HP_Home -.-> Comp_LatestNews["<LatestNews> (from ./components)"]
    end

    %% External API or other components
    subgraph APIsAndComponents [External/Other Components & APIs]
        API_News["/api/news endpoint"]
        Comp_ThemeProvider_src["providers/ThemeProvider.tsx"]
        Comp_AuthProvider_src["contexts/AuthContext.tsx"]
        Comp_FTNewsProvider_src["contexts/FTNewsContext.tsx"]
        Comp_Navbar_src["app/components/Navbar.tsx"]
        Comp_Footer_src["app/components/Footer.tsx"]
        Comp_MultiSourceNews_src["app/components/MultiSourceNews.tsx"]
        Comp_LatestNews_src["app/components/LatestNews.tsx"]
    end

    %% Connections
    RL_childrenRender --> HP_Home

    F_fetch_multi --> API_News
    F_fetch_latest --> API_News
    
    RL_createServerClient ..> LSC_export_note("(Note: server client, not direct import of lib/supabaseClient for this call)")


    %% Styling (optional, for clarity if rendered)
    classDef page fill:#e6ffe6,stroke:#333,stroke-width:2px;
    classDef layout fill:#e6f3ff,stroke:#333,stroke-width:2px;
    classDef lib fill:#fff0e6,stroke:#333,stroke-width:2px;
    classDef component fill:#f0e6ff,stroke:#333,stroke-width:2px;
    classDef api fill:#ffe6f0,stroke:#333,stroke-width:2px;
    classDef context fill:#e6e6fa,stroke:#333,stroke-width:2px;

    class HP_Home,HP_getGroupedNewsData,HP_getInitialLatestNewsData,F_formatPublicationTime page;
    class RL_RootLayout layout;
    class LSC1,LSC_export lib;
    class Comp_ThemeProvider,Comp_AuthProvider,Comp_FTNewsProvider,Comp_Navbar,Comp_Footer,Comp_MultiSourceNews,Comp_LatestNews component;
    class Comp_ThemeProvider_src,Comp_AuthProvider_src,Comp_FTNewsProvider_src context;
    class Comp_Navbar_src,Comp_Footer_src,Comp_MultiSourceNews_src,Comp_LatestNews_src component;
    class API_News api;
```
import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from './providers/ThemeProvider';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'GameVerse',
  description: '游戏社区平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter transition-colors duration-200 bg-white dark:bg-[#121212]" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}

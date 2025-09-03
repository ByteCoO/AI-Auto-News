// app/providers/ThemeProvider.tsx
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
// 修改这一行：
import { type ThemeProviderProps } from 'next-themes'; // 直接从 'next-themes' 导入
import { ThemeContextProvider } from '../contexts/ThemeContext'; // 假设这是你的自定义 Context

// 修改 props 定义以接受所有 next-themes 的 props
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    // 将从 layout.tsx 接收到的 props (如 attribute, defaultTheme, enableSystem等)
    // 传递给 NextThemesProvider
    <NextThemesProvider {...props}>
      <ThemeContextProvider>
        {children}
      </ThemeContextProvider>
    </NextThemesProvider>
  );
}
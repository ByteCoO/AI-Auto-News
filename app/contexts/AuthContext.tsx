'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  mockLogin: () => Promise<void>;
  isMockUser: boolean; // 新增一个状态来标识是否是模拟用户
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockUser, setIsMockUser] = useState(false); // 初始化 isMockUser
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setUser(session?.user ?? null);
        setIsMockUser(false); // 真实登录后，清除模拟用户标记
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsMockUser(false); // 登出后，清除模拟用户标记
      }
      setIsLoading(false);
    });

    // Check initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    getInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase.auth]);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    // Supabase handles redirection, loading state will be managed by onAuthStateChange
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsMockUser(false);
    setIsLoading(false);
    // router.refresh() will be handled in components if needed
  };

  const mockLogin = async () => {
    setIsLoading(true);
    const mockUserData: User = {
      id: 'mock-user-id',
      app_metadata: { provider: 'email', providers: ['email'] },
      user_metadata: { name: 'Mock User', email: 'mock@example.com' },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      email: 'mock@example.com',
      // Add other required User properties with default/mock values
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated',
      updated_at: new Date().toISOString(),
    };
    setUser(mockUserData);
    setIsMockUser(true); // 标记为模拟用户
    setIsLoading(false);
    // router.refresh() will be handled in components if needed
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signInWithGoogle, signOut, mockLogin, isMockUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
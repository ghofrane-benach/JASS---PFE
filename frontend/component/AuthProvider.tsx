'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  mounted: boolean;      // ← clé : true seulement après hydration
  logout: () => void;
  reload: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, isLoggedIn: false, mounted: false,
  logout: () => {}, reload: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [token,   setToken]   = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  function load() {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
  }

  useEffect(() => {
    load();
    setMounted(true);   // ← seulement après lecture localStorage
  }, []);

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!token && !!user,
      mounted,
      logout,
      reload: load,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
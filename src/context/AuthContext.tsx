import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthUser, AuthRole } from '../types';
import {
  clearSession, createUser, getSession, loginWithOtp, loginWithPassword,
  setSession, updateUser, ensureDemoAccount,
} from '../services/authService';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<AuthUser | null>;
  loginPassword: (identifier: string, password: string) => Promise<AuthUser | null>;
  loginDemo: (role: AuthRole) => Promise<AuthUser>;
  signup: (data: Omit<AuthUser, 'id' | 'createdAt'>) => Promise<AuthUser>;
  updateProfile: (patch: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (phone: string, otp: string) => {
    const found = await loginWithOtp(phone, otp);
    if (found) {
      await setSession(found);
      setUser(found);
    }
    return found;
  }, []);

  const loginDemo = useCallback(async (role: AuthRole) => {
    const account = await ensureDemoAccount(role);
    await setSession(account);
    setUser(account);
    return account;
  }, []);

  const loginPassword = useCallback(async (identifier: string, password: string) => {
    const found = await loginWithPassword(identifier, password);
    if (found) {
      await setSession(found);
      setUser(found);
    }
    return found;
  }, []);

  const signup = useCallback(async (data: Omit<AuthUser, 'id' | 'createdAt'>) => {
    const created = await createUser(data);
    await setSession(created);
    setUser(created);
    return created;
  }, []);

  const updateProfile = useCallback(async (patch: Partial<AuthUser>) => {
    if (!user) return;
    const updated = await updateUser(user.id, patch);
    if (updated) {
      await setSession(updated);
      setUser(updated);
    }
  }, [user]);

  const logout = useCallback(async () => {
    await clearSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginPassword, loginDemo, signup, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

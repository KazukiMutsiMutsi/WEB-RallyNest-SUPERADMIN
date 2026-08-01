import React, { createContext, useContext, useState } from 'react';
import type { StaffUser } from '../types';
import { managedStaff } from '../../admin/context/AdminAuthContext';

interface StaffAuthCtx {
  user: StaffUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const StaffAuthContext = createContext<StaffAuthCtx | null>(null);

export function StaffAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);

  const login = async (email: string, password: string) => {
    const e = email.trim().toLowerCase();
    const record = managedStaff.find(s => s.email.toLowerCase() === e);
    if (!record) throw new Error('Invalid staff credentials.');
    if (record.status === 'suspended') throw new Error('This account has been suspended.');
    if (record.password !== password) throw new Error('Invalid staff credentials.');
    setUser({ id: record.id, name: record.name, email: record.email, role: 'staff' });
  };

  const logout = () => setUser(null);

  return (
    <StaffAuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) throw new Error('useStaffAuth must be inside <StaffAuthProvider>');
  return ctx;
}

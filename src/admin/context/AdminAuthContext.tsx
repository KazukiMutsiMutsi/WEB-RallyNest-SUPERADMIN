import React, { createContext, useContext, useState } from 'react';
import type { AdminUser, ManagedAdmin, ManagedStaff } from '../types';

// ── Shared in-memory account registry (module-level so contexts can share) ──
export const managedAdmins: ManagedAdmin[] = [
  {
    id: 'adm-1',
    name: 'Carlos Mendez',
    email: 'admin@picklepro.com',
    password: 'admin123',
    facilityName: 'PicklePro Cebu',
    facilityId: 'fac-1',
    status: 'active',
    createdAt: '2026-01-10',
  },
];

export const managedStaff: ManagedStaff[] = [
  {
    id: 'staff-001',
    name: 'Alex Reyes',
    email: 'staff@picklepro.com',
    password: 'staff123',
    facilityId: 'fac-1',
    status: 'active',
    createdAt: '2026-01-10',
  },
];

// ── Superadmin credentials (fixed — only one superadmin) ────────────────────
const SUPER_CREDENTIALS = { email: 'superadmin@picklepro.com', password: 'super123' };
const SUPER_USER: AdminUser = {
  id: 'super-1',
  name: 'Super Admin',
  email: 'superadmin@picklepro.com',
  role: 'superadmin',
};

// ── Context types ────────────────────────────────────────────────────────────
interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  // Account management (superadmin: create admins; admin: create staff)
  createAdmin: (data: { name: string; email: string; password: string; facilityName: string }) => string | null;
  suspendAdmin: (id: string) => void;
  deleteAdmin: (id: string) => void;
  getAdmins: () => ManagedAdmin[];
  createStaff: (data: { name: string; email: string; password: string }) => string | null;
  suspendStaff: (id: string) => void;
  deleteStaff: (id: string) => void;
  getStaff: () => ManagedStaff[];
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  // Use state to trigger re-renders when lists change
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const login = async (email: string, password: string): Promise<string | null> => {
    const e = email.trim().toLowerCase();

    // Check superadmin
    if (e === SUPER_CREDENTIALS.email && password === SUPER_CREDENTIALS.password) {
      setUser(SUPER_USER);
      return null;
    }

    // Check managed admins
    const admin = managedAdmins.find(a => a.email.toLowerCase() === e);
    if (admin) {
      if (admin.status === 'suspended') return 'This account has been suspended.';
      if (admin.password !== password) return 'Invalid email or password.';
      setUser({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        facilityId: admin.facilityId,
        facilityName: admin.facilityName,
      });
      return null;
    }

    return 'Invalid email or password.';
  };

  const logout = () => setUser(null);

  // ── Admin management (superadmin only) ────────────────────────────────────
  const createAdmin = (data: { name: string; email: string; password: string; facilityName: string }): string | null => {
    const exists = managedAdmins.some(a => a.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) return 'An account with this email already exists.';
    const id = `adm-${Date.now()}`;
    managedAdmins.push({
      id,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      facilityName: data.facilityName.trim(),
      facilityId: `fac-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    refresh();
    return null;
  };

  const suspendAdmin = (id: string) => {
    const a = managedAdmins.find(a => a.id === id);
    if (a) { a.status = a.status === 'suspended' ? 'active' : 'suspended'; refresh(); }
  };

  const deleteAdmin = (id: string) => {
    const i = managedAdmins.findIndex(a => a.id === id);
    if (i !== -1) { managedAdmins.splice(i, 1); refresh(); }
  };

  const getAdmins = () => [...managedAdmins];

  // ── Staff management (admin only — scoped to their facilityId) ────────────
  const createStaff = (data: { name: string; email: string; password: string }): string | null => {
    if (!user || user.role !== 'admin') return 'Only facility admins can create staff.';
    const exists = managedStaff.some(s => s.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) return 'An account with this email already exists.';
    managedStaff.push({
      id: `staff-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      facilityId: user.facilityId!,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    });
    refresh();
    return null;
  };

  const suspendStaff = (id: string) => {
    const s = managedStaff.find(s => s.id === id);
    if (s) { s.status = s.status === 'suspended' ? 'active' : 'suspended'; refresh(); }
  };

  const deleteStaff = (id: string) => {
    const i = managedStaff.findIndex(s => s.id === id);
    if (i !== -1) { managedStaff.splice(i, 1); refresh(); }
  };

  const getStaff = () => {
    if (!user) return [];
    if (user.role === 'superadmin') return [...managedStaff];
    return managedStaff.filter(s => s.facilityId === user.facilityId);
  };

  return (
    <AdminAuthContext.Provider value={{
      user, isAuthenticated: !!user, login, logout,
      createAdmin, suspendAdmin, deleteAdmin, getAdmins,
      createStaff, suspendStaff, deleteStaff, getStaff,
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

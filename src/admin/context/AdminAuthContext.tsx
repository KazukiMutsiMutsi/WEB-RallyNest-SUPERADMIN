import React, { createContext, useContext, useState } from 'react';
import type { AdminUser, AdminPermissions, StaffPermissions, ManagedAdmin, ManagedStaff, TenantRecord } from '../types';
import { initTenantWorkspace } from '../store/tenantStore';

// ── Default permission sets ──────────────────────────────────────────────────
export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  canManageUsers: true,
  canManageCourts: true,
  canManageStaff: true,
  canViewReports: true,
  canManageSettings: true,
  canManagePayments: false,
  canExportData: false,
};

export const DEFAULT_STAFF_PERMISSIONS: StaffPermissions = {
  canCheckIn: true,
  canManageCourts: false,
  canViewSchedule: true,
  canViewPlayers: false,
};

// ── Shared in-memory account registry ────────────────────────────────────────
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
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
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
    permissions: { ...DEFAULT_STAFF_PERMISSIONS },
  },
];

// ── Tenant registry ────────────────────────────────────────────────────────────
let tenantCounter = 2; // T0001 is the seed tenant
export const tenantRegistry: TenantRecord[] = [
  {
    tenantId: 'T0001',
    businessName: 'PicklePro Cebu',
    ownerName: 'Carlos Mendez',
    ownerEmail: 'admin@picklepro.com',
    ownerPassword: 'admin123',
    phone: '+63 917 100 0001',
    address: 'Pajo, Lapu-Lapu City, Cebu',
    courtsCount: 3,
    plan: 'pro',
    trialExpiration: '2026-12-31',
    status: 'active',
    createdAt: '2026-01-10',
    adminId: 'adm-1',
  },
];

// ── Superadmin credentials ────────────────────────────────────────────────────
const SUPER_CREDENTIALS = { email: 'superadmin@picklepro.com', password: 'super123' };
const SUPER_USER: AdminUser = {
  id: 'super-1',
  name: 'Super Admin',
  email: 'superadmin@picklepro.com',
  role: 'superadmin',
};

// ── Context type ──────────────────────────────────────────────────────────────
interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  // Current user's resolved permissions (null for superadmin — has everything)
  adminPermissions: AdminPermissions | null;
  // Admin account management (superadmin only)
  createAdmin: (data: { name: string; email: string; password: string; facilityName: string; permissions?: Partial<AdminPermissions> }) => string | null;
  suspendAdmin: (id: string) => void;
  deleteAdmin: (id: string) => void;
  getAdmins: () => ManagedAdmin[];
  updateAdminPermissions: (id: string, perms: AdminPermissions) => void;
  // Staff account management (admin only)
  createStaff: (data: { name: string; email: string; password: string; permissions?: Partial<StaffPermissions> }) => string | null;
  suspendStaff: (id: string) => void;
  deleteStaff: (id: string) => void;
  getStaff: () => ManagedStaff[];
  updateStaffPermissions: (id: string, perms: StaffPermissions) => void;
  // Tenant management (superadmin only)
  createTenant: (data: {
    businessName: string; ownerName: string; ownerEmail: string; ownerPassword: string;
    phone: string; address: string; courtsCount: number;
    plan: TenantRecord['plan']; trialExpiration: string;
  }) => string | null;
  getTenants: () => TenantRecord[];
  updateTenantStatus: (tenantId: string, status: TenantRecord['status']) => void;
  deleteTenant: (tenantId: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const login = async (email: string, password: string): Promise<string | null> => {
    const e = email.trim().toLowerCase();
    if (e === SUPER_CREDENTIALS.email && password === SUPER_CREDENTIALS.password) {
      setUser(SUPER_USER);
      return null;
    }
    const admin = managedAdmins.find(a => a.email.toLowerCase() === e);
    if (admin) {
      if (admin.status === 'suspended') return 'This account has been suspended.';
      if (admin.password !== password) return 'Invalid email or password.';
      setUser({ id: admin.id, name: admin.name, email: admin.email, role: 'admin', facilityId: admin.facilityId, facilityName: admin.facilityName });
      return null;
    }
    return 'Invalid email or password.';
  };

  const logout = () => setUser(null);

  // Resolved permissions for the current logged-in admin (null = superadmin)
  const adminPermissions: AdminPermissions | null =
    user?.role === 'admin'
      ? (managedAdmins.find(a => a.id === user.id)?.permissions ?? DEFAULT_ADMIN_PERMISSIONS)
      : null;

  // ── Admin management ──────────────────────────────────────────────────────
  const createAdmin = (data: { name: string; email: string; password: string; facilityName: string; permissions?: Partial<AdminPermissions> }): string | null => {
    const exists = managedAdmins.some(a => a.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) return 'An account with this email already exists.';
    managedAdmins.push({
      id: `adm-${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      facilityName: data.facilityName.trim(),
      facilityId: `fac-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      permissions: { ...DEFAULT_ADMIN_PERMISSIONS, ...(data.permissions ?? {}) },
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

  const updateAdminPermissions = (id: string, perms: AdminPermissions) => {
    const a = managedAdmins.find(a => a.id === id);
    if (a) { a.permissions = { ...perms }; refresh(); }
  };

  // ── Staff management ──────────────────────────────────────────────────────
  const createStaff = (data: { name: string; email: string; password: string; permissions?: Partial<StaffPermissions> }): string | null => {
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
      permissions: { ...DEFAULT_STAFF_PERMISSIONS, ...(data.permissions ?? {}) },
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

  const updateStaffPermissions = (id: string, perms: StaffPermissions) => {
    const s = managedStaff.find(s => s.id === id);
    if (s) { s.permissions = { ...perms }; refresh(); }
  };

  // ── Tenant management ─────────────────────────────────────────────────────
  const createTenant = (data: {
    businessName: string; ownerName: string; ownerEmail: string; ownerPassword: string;
    phone: string; address: string; courtsCount: number;
    plan: TenantRecord['plan']; trialExpiration: string;
  }): string | null => {
    const emailLower = data.ownerEmail.trim().toLowerCase();
    if (managedAdmins.some(a => a.email.toLowerCase() === emailLower))
      return 'An account with this email already exists.';
    const tenantId = `T${String(tenantCounter).padStart(4, '0')}`;
    tenantCounter++;
    const facilityId = `fac-${Date.now()}`;
    const adminId = `adm-${Date.now()}`;
    // Create admin account
    managedAdmins.push({
      id: adminId,
      name: data.ownerName.trim(),
      email: emailLower,
      password: data.ownerPassword,
      facilityName: data.businessName.trim(),
      facilityId,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
    });
    // Register tenant
    tenantRegistry.push({
      tenantId,
      businessName: data.businessName.trim(),
      ownerName: data.ownerName.trim(),
      ownerEmail: emailLower,
      ownerPassword: data.ownerPassword,
      phone: data.phone.trim(),
      address: data.address.trim(),
      courtsCount: data.courtsCount,
      plan: data.plan,
      trialExpiration: data.trialExpiration,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      adminId,
    });
    // Initialize isolated workspace
    initTenantWorkspace(facilityId);
    refresh();
    return null;
  };

  const getTenants = () => [...tenantRegistry];

  const updateTenantStatus = (tenantId: string, status: TenantRecord['status']) => {
    const t = tenantRegistry.find(t => t.tenantId === tenantId);
    if (!t) return;
    t.status = status;
    // Also sync the admin account status
    const admin = managedAdmins.find(a => a.id === t.adminId);
    if (admin) admin.status = status === 'suspended' ? 'suspended' : 'active';
    refresh();
  };

  const deleteTenant = (tenantId: string) => {
    const idx = tenantRegistry.findIndex(t => t.tenantId === tenantId);
    if (idx === -1) return;
    const adminId = tenantRegistry[idx].adminId;
    tenantRegistry.splice(idx, 1);
    const ai = managedAdmins.findIndex(a => a.id === adminId);
    if (ai !== -1) managedAdmins.splice(ai, 1);
    refresh();
  };

  return (
    <AdminAuthContext.Provider value={{
      user, isAuthenticated: !!user, login, logout,
      adminPermissions,
      createAdmin, suspendAdmin, deleteAdmin, getAdmins, updateAdminPermissions,
      createStaff, suspendStaff, deleteStaff, getStaff, updateStaffPermissions,
      createTenant, getTenants, updateTenantStatus, deleteTenant,
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

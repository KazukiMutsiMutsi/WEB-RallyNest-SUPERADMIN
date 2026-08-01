/**
 * tenantStore.ts
 * Per-tenant isolated data store. Every court, booking, and customer
 * is keyed by tenantId so each facility admin only ever sees their own data.
 */

import type { AdminCourt, AdminBooking, AdminCustomer } from '../types';

const TODAY = new Date().toISOString().slice(0, 10);
const d = (day: number) => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// ── Per-tenant data maps ──────────────────────────────────────────────────────
const tenantCourts   = new Map<string, AdminCourt[]>();
const tenantBookings = new Map<string, AdminBooking[]>();
const tenantCustomers= new Map<string, AdminCustomer[]>();

// ── Seed data for the default tenant (fac-1 = PicklePro Cebu) ────────────────
tenantCourts.set('fac-1', [
  { id: 'c1', name: 'Court 1', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true },
  { id: 'c2', name: 'Court 2', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true },
  { id: 'c3', name: 'Court 3', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true },
]);

tenantBookings.set('fac-1', [
  { id: 'BKG-001', playerName: 'Juan dela Cruz',    playerPhone: '+63 917 123 4567', courtId: 'c1', courtName: 'Court 1', date: TODAY, startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'checked_in'  },
  { id: 'BKG-002', playerName: 'Maria Santos',      playerPhone: '+63 918 234 5678', courtId: 'c1', courtName: 'Court 1', date: TODAY, startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-003', playerName: 'Pedro Reyes',       playerPhone: '+63 919 345 6789', courtId: 'c1', courtName: 'Court 1', date: TODAY, startTime: '13:00', endTime: '15:00', durationHrs: 2, amount: 420, paid: false, status: 'pending'     },
  { id: 'BKG-004', playerName: 'Ana Gonzales',      playerPhone: '+63 912 456 7890', courtId: 'c3', courtName: 'Court 3', date: TODAY, startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: true,  status: 'reschedule_requested' },
  { id: 'BKG-005', playerName: 'Jose Rizal',        playerPhone: '+63 915 567 8901', courtId: 'c2', courtName: 'Court 2', date: TODAY, startTime: '09:00', endTime: '10:00', durationHrs: 1, amount: 210, paid: true,  status: 'completed'   },
  { id: 'BKG-006', playerName: 'Andres Bonifacio',  playerPhone: '+63 916 678 9012', courtId: 'c2', courtName: 'Court 2', date: TODAY, startTime: '13:00', endTime: '15:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-007', playerName: 'Emilio Aguinaldo',  playerPhone: '+63 920 789 0123', courtId: 'c3', courtName: 'Court 3', date: TODAY, startTime: '17:00', endTime: '19:00', durationHrs: 2, amount: 420, paid: false, status: 'reschedule_requested' },
  { id: 'BKG-008', playerName: 'Gabriela Silang',   playerPhone: '+63 921 890 1234', courtId: 'c1', courtName: 'Court 1', date: TODAY, startTime: '16:00', endTime: '18:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-009', playerName: 'Apolinario Mabini', playerPhone: '+63 922 901 2345', courtId: 'c3', courtName: 'Court 3', date: TODAY, startTime: '15:00', endTime: '17:00', durationHrs: 2, amount: 420, paid: true,  status: 'no_show'     },
  { id: 'BKG-010', playerName: 'Melchora Aquino',   playerPhone: '+63 923 012 3456', courtId: 'c2', courtName: 'Court 2', date: TODAY, startTime: '18:00', endTime: '19:00', durationHrs: 1, amount: 210, paid: false, status: 'cancelled'   },
  { id: 'BKG-011', playerName: 'Ramon Magsaysay',   playerPhone: '+63 917 111 2222', courtId: 'c1', courtName: 'Court 1', date: d(3),  startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'completed'   },
  { id: 'BKG-012', playerName: 'Corazon Aquino',    playerPhone: '+63 918 222 3333', courtId: 'c2', courtName: 'Court 2', date: d(3),  startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: true,  status: 'completed'   },
  { id: 'BKG-013', playerName: 'Diego Silang',      playerPhone: '+63 917 888 9999', courtId: 'c1', courtName: 'Court 1', date: d(12), startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-014', playerName: 'Antonio Luna',      playerPhone: '+63 920 111 2222', courtId: 'c1', courtName: 'Court 1', date: d(14), startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
]);

tenantCustomers.set('fac-1', [
  { id: 'u1', name: 'Juan dela Cruz',   email: 'juan@email.com',   phone: '+63 917 123 4567', joinedDate: '2026-01-15', totalBookings: 8,  totalSpent: 3360, status: 'active'  },
  { id: 'u2', name: 'Maria Santos',     email: 'maria@email.com',  phone: '+63 918 234 5678', joinedDate: '2026-02-20', totalBookings: 5,  totalSpent: 2100, status: 'active'  },
  { id: 'u3', name: 'Pedro Reyes',      email: 'pedro@email.com',  phone: '+63 919 345 6789', joinedDate: '2026-03-05', totalBookings: 3,  totalSpent: 1260, status: 'active'  },
  { id: 'u4', name: 'Ana Gonzales',     email: 'ana@email.com',    phone: '+63 912 456 7890', joinedDate: '2026-01-30', totalBookings: 12, totalSpent: 5040, status: 'active'  },
  { id: 'u5', name: 'Jose Rizal',       email: 'jose@email.com',   phone: '+63 915 567 8901', joinedDate: '2026-04-10', totalBookings: 2,  totalSpent: 420,  status: 'active'  },
  { id: 'u6', name: 'Andres Bonifacio', email: 'andres@email.com', phone: '+63 916 678 9012', joinedDate: '2026-02-14', totalBookings: 7,  totalSpent: 2940, status: 'active'  },
  { id: 'u7', name: 'Emilio Aguinaldo', email: 'emilio@email.com', phone: '+63 920 789 0123', joinedDate: '2026-05-01', totalBookings: 1,  totalSpent: 210,  status: 'flagged' },
]);

// ── Courts ────────────────────────────────────────────────────────────────────
export function getTenantCourts(tenantId: string): AdminCourt[] {
  return tenantCourts.get(tenantId) ?? [];
}

export function addTenantCourt(tenantId: string, court: AdminCourt): void {
  const list = tenantCourts.get(tenantId) ?? [];
  tenantCourts.set(tenantId, [...list, court]);
}

export function updateTenantCourt(tenantId: string, id: string, changes: Partial<AdminCourt>): void {
  const list = tenantCourts.get(tenantId) ?? [];
  tenantCourts.set(tenantId, list.map(c => c.id === id ? { ...c, ...changes } : c));
}

export function deleteTenantCourt(tenantId: string, id: string): void {
  const list = tenantCourts.get(tenantId) ?? [];
  tenantCourts.set(tenantId, list.filter(c => c.id !== id));
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export function getTenantBookings(tenantId: string): AdminBooking[] {
  return tenantBookings.get(tenantId) ?? [];
}

export function addTenantBooking(tenantId: string, booking: AdminBooking): void {
  const list = tenantBookings.get(tenantId) ?? [];
  tenantBookings.set(tenantId, [booking, ...list]);
}

export function updateTenantBooking(tenantId: string, id: string, changes: Partial<AdminBooking>): void {
  const list = tenantBookings.get(tenantId) ?? [];
  tenantBookings.set(tenantId, list.map(b => b.id === id ? { ...b, ...changes } : b));
}

// ── Customers ─────────────────────────────────────────────────────────────────
export function getTenantCustomers(tenantId: string): AdminCustomer[] {
  return tenantCustomers.get(tenantId) ?? [];
}

export function updateTenantCustomer(tenantId: string, id: string, changes: Partial<AdminCustomer>): void {
  const list = tenantCustomers.get(tenantId) ?? [];
  tenantCustomers.set(tenantId, list.map(u => u.id === id ? { ...u, ...changes } : u));
}

// ── Tenant workspace initializer (called when a new tenant is created) ────────
export function initTenantWorkspace(tenantId: string): void {
  if (!tenantCourts.has(tenantId))    tenantCourts.set(tenantId, []);
  if (!tenantBookings.has(tenantId))  tenantBookings.set(tenantId, []);
  if (!tenantCustomers.has(tenantId)) tenantCustomers.set(tenantId, []);
}

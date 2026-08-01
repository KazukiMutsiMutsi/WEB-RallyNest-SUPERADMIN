/**
 * TenantContext
 * Provides per-tenant CRUD for courts, bookings, and customers.
 * Admin screens read/write through this context — never directly
 * from the global bookingStore or mock data.
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getTenantCourts, addTenantCourt, updateTenantCourt, deleteTenantCourt,
  getTenantBookings, addTenantBooking, updateTenantBooking,
  getTenantCustomers, updateTenantCustomer,
} from '../store/tenantStore';
import type { AdminCourt, AdminBooking, AdminCustomer } from '../types';

interface TenantCtx {
  tenantId: string;
  // Courts
  courts: AdminCourt[];
  addCourt:    (c: AdminCourt) => void;
  updateCourt: (id: string, changes: Partial<AdminCourt>) => void;
  deleteCourt: (id: string) => void;
  // Bookings
  bookings: AdminBooking[];
  addBooking:    (b: AdminBooking) => void;
  updateBooking: (id: string, changes: Partial<AdminBooking>) => void;
  // Customers
  customers: AdminCustomer[];
  updateCustomer: (id: string, changes: Partial<AdminCustomer>) => void;
  // Force re-read from store
  refresh: () => void;
}

const TenantContext = createContext<TenantCtx | null>(null);

export function TenantProvider({ tenantId, children }: { tenantId: string; children: React.ReactNode }) {
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick(t => t + 1), []);

  // Derive data live from store on each render (tick forces re-read)
  const courts    = getTenantCourts(tenantId);
  const bookings  = getTenantBookings(tenantId);
  const customers = getTenantCustomers(tenantId);

  // Suppress unused variable warning for tick — it's used to trigger re-renders
  void tick;

  const addCourt    = (c: AdminCourt) => { addTenantCourt(tenantId, c); refresh(); };
  const updateCourt = (id: string, ch: Partial<AdminCourt>) => { updateTenantCourt(tenantId, id, ch); refresh(); };
  const deleteCourt = (id: string) => { deleteTenantCourt(tenantId, id); refresh(); };

  const addBooking    = (b: AdminBooking) => { addTenantBooking(tenantId, b); refresh(); };
  const updateBooking = (id: string, ch: Partial<AdminBooking>) => { updateTenantBooking(tenantId, id, ch); refresh(); };

  const updateCustomer = (id: string, ch: Partial<AdminCustomer>) => { updateTenantCustomer(tenantId, id, ch); refresh(); };

  return (
    <TenantContext.Provider value={{
      tenantId,
      courts, addCourt, updateCourt, deleteCourt,
      bookings, addBooking, updateBooking,
      customers, updateCustomer,
      refresh,
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantCtx {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be inside <TenantProvider>');
  return ctx;
}

import { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminBookings from './screens/AdminBookings';
import AdminCourts from './screens/AdminCourts';
import AdminDashboard from './screens/AdminDashboard';
import AdminReports from './screens/AdminReports';
import AdminSettings from './screens/AdminSettings';
import AdminStaff from './screens/AdminStaff';
import AdminUsers from './screens/AdminUsers';
import SuperTenants from './screens/SuperTenants';
import SuperOwners from './screens/SuperOwners';
import SuperSubscriptions from './screens/SuperSubscriptions';
import SuperGlobalDashboard from './screens/SuperGlobalDashboard';
import SuperRevenue from './screens/SuperRevenue';
import SuperAnnouncements from './screens/SuperAnnouncements';
import SuperSupport from './screens/SuperSupport';
import SuperPlatformAnalytics from './screens/SuperPlatformAnalytics';
import SuperSecurity from './screens/SuperSecurity';
import SuperPlatformSettings from './screens/SuperPlatformSettings';
import SuperPaymentGateways from './screens/SuperPaymentGateways';
import SuperPlatformReports from './screens/SuperPlatformReports';
import SuperReviews from './screens/SuperReviews';
import SuperFeatures from './screens/SuperFeatures';
import SuperBackup from './screens/SuperBackup';
import SuperAdmins from './screens/SuperAdmins';
import type { AdminPage } from './types';

const SUPER_PAGES: AdminPage[] = [
  'global-dashboard', 'tenants', 'owners', 'subscriptions', 'revenue',
  'announcements', 'support', 'platform-analytics', 'security',
  'platform-settings', 'payment-gateways', 'platform-reports',
  'reviews', 'features', 'backup', 'admins',
];

export function AdminPortal() {
  const { isAuthenticated, user } = useAdminAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const defaultPage: AdminPage = isSuperAdmin ? 'global-dashboard' : 'dashboard';
  const [page, setPage] = useState<AdminPage>(defaultPage);

  useEffect(() => {
    if (!isSuperAdmin && SUPER_PAGES.includes(page)) setPage('dashboard');
  }, [isSuperAdmin, page]);

  if (!isAuthenticated) return null;

  const navigate = (p: AdminPage) => {
    if (!isSuperAdmin && SUPER_PAGES.includes(p)) return;
    setPage(p);
  };

  return (
    <AdminLayout page={page} onNavigate={navigate}>
      {page === 'dashboard'          && <AdminDashboard        />}
      {page === 'bookings'           && <AdminBookings         />}
      {page === 'courts'             && <AdminCourts           />}
      {page === 'users'              && <AdminUsers            />}
      {page === 'staff'              && <AdminStaff            />}
      {page === 'reports'            && <AdminReports          />}
      {page === 'settings'           && <AdminSettings         />}
      {isSuperAdmin && page === 'global-dashboard'   && <SuperGlobalDashboard  />}
      {isSuperAdmin && page === 'tenants'            && <SuperTenants          />}
      {isSuperAdmin && page === 'owners'             && <SuperOwners           />}
      {isSuperAdmin && page === 'admins'             && <SuperAdmins           />}
      {isSuperAdmin && page === 'subscriptions'      && <SuperSubscriptions    />}
      {isSuperAdmin && page === 'revenue'            && <SuperRevenue          />}
      {isSuperAdmin && page === 'announcements'      && <SuperAnnouncements    />}
      {isSuperAdmin && page === 'support'            && <SuperSupport          />}
      {isSuperAdmin && page === 'platform-analytics' && <SuperPlatformAnalytics/>}
      {isSuperAdmin && page === 'security'           && <SuperSecurity         />}
      {isSuperAdmin && page === 'platform-settings'  && <SuperPlatformSettings />}
      {isSuperAdmin && page === 'payment-gateways'   && <SuperPaymentGateways  />}
      {isSuperAdmin && page === 'platform-reports'   && <SuperPlatformReports  />}
      {isSuperAdmin && page === 'reviews'            && <SuperReviews          />}
      {isSuperAdmin && page === 'features'           && <SuperFeatures         />}
      {isSuperAdmin && page === 'backup'             && <SuperBackup           />}
    </AdminLayout>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminPortal />
    </AdminAuthProvider>
  );
}

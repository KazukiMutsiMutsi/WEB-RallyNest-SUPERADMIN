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
import SuperUsers from './screens/SuperUsers';
import type { AdminPage } from './types';

const SUPER_PAGES: AdminPage[] = [
  'global-dashboard', 'tenants', 'owners', 'subscriptions', 'revenue',
  'announcements', 'support', 'platform-analytics', 'security',
  'platform-settings', 'payment-gateways', 'platform-reports',
  'reviews', 'features', 'backup', 'admins', 'super-users',
];

export function AdminPortal() {
  const { isAuthenticated, user, adminPermissions } = useAdminAuth();
  const isSuperAdmin = user?.role === 'superadmin';
  const [page, setPage] = useState<AdminPage>('dashboard');

  useEffect(() => {
    if (user?.role === 'superadmin') setPage('global-dashboard');
    else setPage('dashboard');
  }, [user?.role]);

  useEffect(() => {
    if (!isSuperAdmin && SUPER_PAGES.includes(page)) { setPage('dashboard'); return; }
    if (!isSuperAdmin && adminPermissions) {
      if (page === 'users'    && !adminPermissions.canManageUsers)    { setPage('dashboard'); return; }
      if (page === 'courts'   && !adminPermissions.canManageCourts)   { setPage('dashboard'); return; }
      if (page === 'staff'    && !adminPermissions.canManageStaff)    { setPage('dashboard'); return; }
      if (page === 'reports'  && !adminPermissions.canViewReports)    { setPage('dashboard'); return; }
      if (page === 'settings' && !adminPermissions.canManageSettings) { setPage('dashboard'); return; }
    }
  }, [isSuperAdmin, adminPermissions, page]);

  if (!isAuthenticated) return null;

  const navigate = (p: AdminPage) => {
    if (!isSuperAdmin && SUPER_PAGES.includes(p)) return;
    if (!isSuperAdmin && adminPermissions) {
      if (p === 'users'    && !adminPermissions.canManageUsers)    return;
      if (p === 'courts'   && !adminPermissions.canManageCourts)   return;
      if (p === 'staff'    && !adminPermissions.canManageStaff)    return;
      if (p === 'reports'  && !adminPermissions.canViewReports)    return;
      if (p === 'settings' && !adminPermissions.canManageSettings) return;
    }
    setPage(p);
  };

  return (
    <AdminLayout page={page} onNavigate={navigate} adminPermissions={adminPermissions}>
      {page === 'dashboard'                                                   && <AdminDashboard        />}
      {page === 'bookings'                                                    && <AdminBookings         />}
      {page === 'courts'   && (!adminPermissions || adminPermissions.canManageCourts)   && <AdminCourts />}
      {page === 'users'    && (!adminPermissions || adminPermissions.canManageUsers)    && <AdminUsers  />}
      {page === 'staff'    && (!adminPermissions || adminPermissions.canManageStaff)    && <AdminStaff  />}
      {page === 'reports'  && (!adminPermissions || adminPermissions.canViewReports)    && <AdminReports />}
      {page === 'settings' && (!adminPermissions || adminPermissions.canManageSettings) && <AdminSettings />}
      {isSuperAdmin && page === 'global-dashboard'   && <SuperGlobalDashboard  />}
      {isSuperAdmin && page === 'tenants'            && <SuperTenants          />}
      {isSuperAdmin && page === 'owners'             && <SuperOwners           />}
      {isSuperAdmin && page === 'admins'             && <SuperAdmins           />}
      {isSuperAdmin && page === 'super-users'        && <SuperUsers            />}
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
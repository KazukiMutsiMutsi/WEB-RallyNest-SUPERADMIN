import { useEffect, useState } from 'react';
import StaffLayout from './components/StaffLayout';
import { StaffAuthProvider, useStaffAuth } from './context/StaffAuthContext';
import StaffCheckIn from './screens/StaffCheckIn';
import StaffCourts from './screens/StaffCourts';
import StaffDashboard from './screens/StaffDashboard';
import StaffPlayers from './screens/StaffPlayers';
import StaffSchedule from './screens/StaffSchedule';
import type { StaffPage } from './types';

export function StaffPortal() {
  const { isAuthenticated, permissions } = useStaffAuth();
  const [page, setPage] = useState<StaffPage>('dashboard');

  // If current page becomes forbidden (permissions changed), redirect to dashboard
  useEffect(() => {
    if (page === 'checkin'  && !permissions.canCheckIn)      setPage('dashboard');
    if (page === 'courts'   && !permissions.canManageCourts) setPage('dashboard');
    if (page === 'schedule' && !permissions.canViewSchedule) setPage('dashboard');
    if (page === 'players'  && !permissions.canViewPlayers)  setPage('dashboard');
  }, [permissions, page]);

  if (!isAuthenticated) return null;

  const navigate = (p: StaffPage) => {
    if (p === 'checkin'  && !permissions.canCheckIn)      return;
    if (p === 'courts'   && !permissions.canManageCourts) return;
    if (p === 'schedule' && !permissions.canViewSchedule) return;
    if (p === 'players'  && !permissions.canViewPlayers)  return;
    setPage(p);
  };

  return (
    <StaffLayout page={page} onNavigate={navigate}>
      {page === 'dashboard'                          && <StaffDashboard />}
      {page === 'schedule'  && permissions.canViewSchedule  && <StaffSchedule  />}
      {page === 'courts'    && permissions.canManageCourts  && <StaffCourts    />}
      {page === 'checkin'   && permissions.canCheckIn       && <StaffCheckIn   />}
      {page === 'players'   && permissions.canViewPlayers   && <StaffPlayers   />}
    </StaffLayout>
  );
}

export default function StaffApp() {
  return (
    <StaffAuthProvider>
      <StaffPortal />
    </StaffAuthProvider>
  );
}

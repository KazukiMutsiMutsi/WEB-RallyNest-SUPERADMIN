import React from 'react';

type IconProps = { size?: number; color?: string; strokeWidth?: number };

const i = (d: string, opts?: { fill?: boolean }) =>
  ({ size = 16, color = 'currentColor', strokeWidth = 1.75 }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={opts?.fill ? color : 'none'}
      stroke={opts?.fill ? 'none' : color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );

export const IconDashboard   = i('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10');
export const IconBookings    = i('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z');
export const IconCourts      = i('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');
export const IconUsers       = i('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75');
export const IconStaff       = i('M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z');
export const IconReports     = i('M18 20V10M12 20V4M6 20v-6');
export const IconSettings    = i('M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z');
export const IconLogout      = i('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9');
export const IconSearch      = i('M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z');
export const IconPlus        = i('M12 5v14M5 12h14');
export const IconEdit        = i('M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z');
export const IconTrash       = i('M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6');
export const IconLock        = i('M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4');
export const IconUnlock      = i('M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 019.9-1');
export const IconChevronLeft = i('M15 18l-6-6 6-6');
export const IconChevronRight= i('M9 18l6-6-6-6');
export const IconMenu        = i('M3 12h18M3 6h18M3 18h18');
export const IconX           = i('M18 6L6 18M6 6l12 12');
export const IconCheck       = i('M20 6L9 17l-5-5');
export const IconAlert       = i('M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01');
export const IconFlag        = i('M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7');
export const IconBan         = i('M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636');
export const IconRefresh     = i('M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15');
export const IconClock       = i('M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2');
export const IconLocation    = i('M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z');
export const IconSave        = i('M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8');
export const IconEye         = i('M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 100-6 3 3 0 000 6z');
export const IconPause       = i('M10 9v6M14 9v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const IconPlay        = i('M5 3l14 9-14 9V3z');
export const IconTrending    = i('M23 6l-9.5 9.5-5-5L1 18M17 6h6v6');
export const IconMoney       = i('M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6');
export const IconCalendar    = i('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z');
export const IconLayers      = i('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');

export const IconBuilding      = i('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10');
export const IconGlobe         = i('M12 22a10 10 0 100-20 10 10 0 000 20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z');
export const IconCreditCard    = i('M1 4h22v16H1zM1 10h22');
export const IconAnnounce      = i('M22 12A10 10 0 002 12M18 12a6 6 0 00-12 0M2 12h2m16 0h2M12 2v2m0 16v2');
export const IconHeadset       = i('M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3zM16 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2h-3z');
export const IconActivity      = i('M22 12h-4l-3 9L9 3l-3 9H2');
export const IconShield        = i('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
export const IconGateway       = i('M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18');
export const IconStar          = i('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z');
export const IconToggle        = i('M5 12a7 7 0 0014 0M5 12a7 7 0 0114 0M5 12H3m18 0h-2m-7-7V3m0 18v-2');
export const IconDatabase      = i('M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3M4 6c0-1.657 3.582-3 8-3s8 1.343 8 3M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6');
export const IconOwner         = i('M20 21v-2a4 4 0 00-4-4h-4a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8M22 9l-4 4-2-2');

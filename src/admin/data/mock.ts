import type { AdminBooking, AdminCourt, AdminCustomer, AdminStaffMember, AuditEntry, PlatformUser } from '../types';

export const TODAY = new Date().toISOString().slice(0, 10);

const d = (day: number) => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const ADMIN_COURTS: AdminCourt[] = [
  { id: 'c1', name: 'Court 1', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true  },
  { id: 'c2', name: 'Court 2', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true  },
  { id: 'c3', name: 'Court 3', location: 'Pajo, Lapu-Lapu City', type: 'Indoor', pricePerHour: 210, active: true  },
];

export const ADMIN_BOOKINGS: AdminBooking[] = [
  { id: 'BKG-001', playerName: 'Juan dela Cruz',     playerPhone: '+63 917 123 4567', courtId: 'c1', courtName: 'Court 1', date: TODAY,  startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'checked_in'  },
  { id: 'BKG-002', playerName: 'Maria Santos',       playerPhone: '+63 918 234 5678', courtId: 'c1', courtName: 'Court 1', date: TODAY,  startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-003', playerName: 'Pedro Reyes',        playerPhone: '+63 919 345 6789', courtId: 'c1', courtName: 'Court 1', date: TODAY,  startTime: '13:00', endTime: '15:00', durationHrs: 2, amount: 420, paid: false, status: 'pending'     },
  { id: 'BKG-004', playerName: 'Ana Gonzales',       playerPhone: '+63 912 456 7890', courtId: 'c3', courtName: 'Court 3', date: TODAY,  startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: true,  status: 'reschedule_requested' },
  { id: 'BKG-005', playerName: 'Jose Rizal',         playerPhone: '+63 915 567 8901', courtId: 'c2', courtName: 'Court 2', date: TODAY,  startTime: '09:00', endTime: '10:00', durationHrs: 1, amount: 210, paid: true,  status: 'completed'   },
  { id: 'BKG-006', playerName: 'Andres Bonifacio',   playerPhone: '+63 916 678 9012', courtId: 'c2', courtName: 'Court 2', date: TODAY,  startTime: '13:00', endTime: '15:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-007', playerName: 'Emilio Aguinaldo',   playerPhone: '+63 920 789 0123', courtId: 'c3', courtName: 'Court 3', date: TODAY,  startTime: '17:00', endTime: '19:00', durationHrs: 2, amount: 420, paid: false, status: 'reschedule_requested' },
  { id: 'BKG-008', playerName: 'Gabriela Silang',    playerPhone: '+63 921 890 1234', courtId: 'c1', courtName: 'Court 1', date: TODAY,  startTime: '16:00', endTime: '18:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-009', playerName: 'Apolinario Mabini',  playerPhone: '+63 922 901 2345', courtId: 'c3', courtName: 'Court 3', date: TODAY,  startTime: '15:00', endTime: '17:00', durationHrs: 2, amount: 420, paid: true,  status: 'no_show'     },
  { id: 'BKG-010', playerName: 'Melchora Aquino',    playerPhone: '+63 923 012 3456', courtId: 'c2', courtName: 'Court 2', date: TODAY,  startTime: '18:00', endTime: '19:00', durationHrs: 1, amount: 210, paid: false, status: 'cancelled'   },
  { id: 'BKG-011', playerName: 'Ramon Magsaysay',    playerPhone: '+63 917 111 2222', courtId: 'c1', courtName: 'Court 1', date: d(3),   startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'completed'   },
  { id: 'BKG-012', playerName: 'Corazon Aquino',     playerPhone: '+63 918 222 3333', courtId: 'c2', courtName: 'Court 2', date: d(3),   startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: true,  status: 'completed'   },
  { id: 'BKG-013', playerName: 'Ferdinand Marcos',   playerPhone: '+63 919 333 4444', courtId: 'c3', courtName: 'Court 3', date: d(5),   startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: true,  status: 'completed'   },
  { id: 'BKG-014', playerName: 'Diego Silang',       playerPhone: '+63 917 888 9999', courtId: 'c1', courtName: 'Court 1', date: d(12),  startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-015', playerName: 'Teresa Magbanua',    playerPhone: '+63 918 999 0000', courtId: 'c2', courtName: 'Court 2', date: d(12),  startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: false, status: 'confirmed'   },
  { id: 'BKG-016', playerName: 'Antonio Luna',       playerPhone: '+63 920 111 2222', courtId: 'c1', courtName: 'Court 1', date: d(14),  startTime: '09:00', endTime: '11:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-017', playerName: 'Melchora Santos',    playerPhone: '+63 921 222 3333', courtId: 'c1', courtName: 'Court 1', date: d(14),  startTime: '16:00', endTime: '18:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-018', playerName: 'Juan Luna',          playerPhone: '+63 922 333 4444', courtId: 'c2', courtName: 'Court 2', date: d(16),  startTime: '10:00', endTime: '12:00', durationHrs: 2, amount: 420, paid: false, status: 'pending'     },
  { id: 'BKG-019', playerName: 'Felix Resurreccion', playerPhone: '+63 923 444 5555', courtId: 'c3', courtName: 'Court 3', date: d(17),  startTime: '14:00', endTime: '16:00', durationHrs: 2, amount: 420, paid: true,  status: 'confirmed'   },
  { id: 'BKG-020', playerName: 'Lorena Barros',      playerPhone: '+63 918 666 7777', courtId: 'c2', courtName: 'Court 2', date: d(21),  startTime: '09:00', endTime: '10:00', durationHrs: 1, amount: 210, paid: true,  status: 'confirmed'   },
];

export const ADMIN_CUSTOMERS: AdminCustomer[] = [
  { id: 'u1', name: 'Juan dela Cruz',     email: 'juan@email.com',     phone: '+63 917 123 4567', joinedDate: '2026-01-15', totalBookings: 8,  totalSpent: 3360, status: 'active'  },
  { id: 'u2', name: 'Maria Santos',       email: 'maria@email.com',    phone: '+63 918 234 5678', joinedDate: '2026-02-20', totalBookings: 5,  totalSpent: 2100, status: 'active'  },
  { id: 'u3', name: 'Pedro Reyes',        email: 'pedro@email.com',    phone: '+63 919 345 6789', joinedDate: '2026-03-05', totalBookings: 3,  totalSpent: 1260, status: 'active'  },
  { id: 'u4', name: 'Ana Gonzales',       email: 'ana@email.com',      phone: '+63 912 456 7890', joinedDate: '2026-01-30', totalBookings: 12, totalSpent: 5040, status: 'active'  },
  { id: 'u5', name: 'Jose Rizal',         email: 'jose@email.com',     phone: '+63 915 567 8901', joinedDate: '2026-04-10', totalBookings: 2,  totalSpent: 420,  status: 'active'  },
  { id: 'u6', name: 'Andres Bonifacio',   email: 'andres@email.com',   phone: '+63 916 678 9012', joinedDate: '2026-02-14', totalBookings: 7,  totalSpent: 2940, status: 'active'  },
  { id: 'u7', name: 'Emilio Aguinaldo',   email: 'emilio@email.com',   phone: '+63 920 789 0123', joinedDate: '2026-05-01', totalBookings: 1,  totalSpent: 210,  status: 'flagged' },
  { id: 'u8', name: 'Gabriela Silang',    email: 'gabriela@email.com', phone: '+63 921 890 1234', joinedDate: '2026-03-22', totalBookings: 4,  totalSpent: 1680, status: 'active'  },
  { id: 'u9', name: 'Apolinario Mabini',  email: 'apolinario@email.com',phone: '+63 922 901 2345',joinedDate: '2026-01-08', totalBookings: 6,  totalSpent: 2520, status: 'banned'  },
  { id:'u10', name: 'Melchora Aquino',    email: 'melchora@email.com', phone: '+63 923 012 3456', joinedDate: '2026-06-01', totalBookings: 1,  totalSpent: 0,    status: 'active'  },
];

export const ADMIN_STAFF: AdminStaffMember[] = [
  { id: 's1', name: 'Alex Reyes',    email: 'staff@picklepro.com',  phone: '+63 917 000 0001', joinedDate: '2026-01-01', lastLogin: TODAY,  status: 'active',    totalActions: 142 },
  { id: 's2', name: 'Bea Santos',    email: 'bea@picklepro.com',    phone: '+63 917 000 0002', joinedDate: '2026-02-15', lastLogin: d(10),  status: 'active',    totalActions: 98  },
  { id: 's3', name: 'Carlo Reyes',   email: 'carlo@picklepro.com',  phone: '+63 917 000 0003', joinedDate: '2026-03-01', lastLogin: d(8),   status: 'suspended', totalActions: 34  },
  { id: 's4', name: 'Diana Cruz',    email: 'diana@picklepro.com',  phone: '+63 917 000 0004', joinedDate: '2026-04-10', lastLogin: d(12),  status: 'active',    totalActions: 77  },
];

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'a1',  staffName: 'Alex Reyes',  action: 'Approved booking',    target: 'BKG-003 — Pedro Reyes',       timestamp: `${TODAY} 09:15` },
  { id: 'a2',  staffName: 'Alex Reyes',  action: 'Marked On Court',     target: 'BKG-001 — Juan dela Cruz',    timestamp: `${TODAY} 09:05` },
  { id: 'a3',  staffName: 'Bea Santos',  action: 'Declined reschedule', target: 'BKG-004 — Ana Gonzales',      timestamp: `${TODAY} 08:50` },
  { id: 'a4',  staffName: 'Alex Reyes',  action: 'Closed Court 2',      target: 'Court 2 — Maintenance',       timestamp: `${d(10)} 18:00` },
  { id: 'a5',  staffName: 'Diana Cruz',  action: 'Approved booking',    target: 'BKG-018 — Juan Luna',         timestamp: `${d(10)} 14:30` },
  { id: 'a6',  staffName: 'Carlo Reyes', action: 'Marked No Show',      target: 'BKG-009 — Apolinario Mabini', timestamp: `${d(8)} 17:10`  },
  { id: 'a7',  staffName: 'Bea Santos',  action: 'Completed booking',   target: 'BKG-005 — Jose Rizal',        timestamp: `${TODAY} 10:05` },
];

import type {
  Tenant, OwnerAccount, Subscription, Announcement,
  SupportTicket, PaymentGateway, Review, PlatformFeature, BackupEntry,
} from '../types';

export const TENANTS: Tenant[] = [
  { id:'t1', facilityName:'PicklePro Cebu',     ownerName:'Carlos Mendez',  email:'carlos@picklepro.com',  phone:'+63 917 100 0001', location:'Lapu-Lapu City',  plan:'pro',        status:'active',    courtsCount:3, joinedDate:'2026-01-10', monthlyRevenue:28000 },
  { id:'t2', facilityName:'Smash Arena Manila',  ownerName:'Diana Reyes',    email:'diana@smasharena.com',  phone:'+63 918 200 0002', location:'Makati City',     plan:'enterprise', status:'active',    courtsCount:6, joinedDate:'2025-11-05', monthlyRevenue:75000 },
  { id:'t3', facilityName:'Net & Rally Davao',   ownerName:'Eduardo Santos', email:'eduardo@netrally.com',  phone:'+63 919 300 0003', location:'Davao City',      plan:'starter',    status:'active',    courtsCount:2, joinedDate:'2026-03-20', monthlyRevenue:12000 },
  { id:'t4', facilityName:'Ace Sports Iloilo',   ownerName:'Fiona Cruz',     email:'fiona@acesports.com',   phone:'+63 920 400 0004', location:'Iloilo City',     plan:'pro',        status:'suspended', courtsCount:4, joinedDate:'2026-02-14', monthlyRevenue:0     },
  { id:'t5', facilityName:'Court Kings Cagayan', ownerName:'George Tan',     email:'george@courtkings.com', phone:'+63 921 500 0005', location:'Cagayan de Oro',  plan:'starter',    status:'pending',   courtsCount:1, joinedDate:'2026-07-01', monthlyRevenue:0     },
];

export const OWNER_ACCOUNTS: OwnerAccount[] = [
  { id:'o1', name:'Carlos Mendez',  email:'carlos@picklepro.com',  phone:'+63 917 100 0001', facilitiesCount:1, status:'active',    joinedDate:'2026-01-10', totalRevenue:168000, plan:'pro'        },
  { id:'o2', name:'Diana Reyes',    email:'diana@smasharena.com',  phone:'+63 918 200 0002', facilitiesCount:2, status:'active',    joinedDate:'2025-11-05', totalRevenue:450000, plan:'enterprise' },
  { id:'o3', name:'Eduardo Santos', email:'eduardo@netrally.com',  phone:'+63 919 300 0003', facilitiesCount:1, status:'active',    joinedDate:'2026-03-20', totalRevenue:48000,  plan:'starter'    },
  { id:'o4', name:'Fiona Cruz',     email:'fiona@acesports.com',   phone:'+63 920 400 0004', facilitiesCount:1, status:'suspended', joinedDate:'2026-02-14', totalRevenue:20000,  plan:'pro'        },
  { id:'o5', name:'George Tan',     email:'george@courtkings.com', phone:'+63 921 500 0005', facilitiesCount:1, status:'pending',   joinedDate:'2026-07-01', totalRevenue:0,      plan:'starter'    },
];

export const SUBSCRIPTIONS: Subscription[] = [
  { id:'sub1', tenantName:'PicklePro Cebu',     plan:'pro',        status:'active',    amount:2999,  billingCycle:'monthly', nextBillingDate:'2026-08-10', startDate:'2026-01-10' },
  { id:'sub2', tenantName:'Smash Arena Manila',  plan:'enterprise', status:'active',    amount:7999,  billingCycle:'monthly', nextBillingDate:'2026-08-05', startDate:'2025-11-05' },
  { id:'sub3', tenantName:'Net & Rally Davao',   plan:'starter',    status:'trialing',  amount:0,     billingCycle:'monthly', nextBillingDate:'2026-08-20', startDate:'2026-07-20' },
  { id:'sub4', tenantName:'Ace Sports Iloilo',   plan:'pro',        status:'past_due',  amount:2999,  billingCycle:'monthly', nextBillingDate:'2026-07-14', startDate:'2026-02-14' },
  { id:'sub5', tenantName:'Court Kings Cagayan', plan:'starter',    status:'trialing',  amount:0,     billingCycle:'monthly', nextBillingDate:'2026-08-01', startDate:'2026-07-01' },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id:'an1', title:'Scheduled Maintenance – Aug 5',  message:'Platform will be down for maintenance on Aug 5 from 2–4 AM PST.', target:'all',    status:'published', createdAt:'2026-07-28', publishedAt:'2026-07-28' },
  { id:'an2', title:'New Feature: Multi-Court View',   message:'Facility owners can now view all courts on a single calendar.',   target:'owners', status:'published', createdAt:'2026-07-20', publishedAt:'2026-07-21' },
  { id:'an3', title:'August Promo for Users',          message:'Book 3 sessions, get 1 free. Valid Aug 1–31.',                    target:'users',  status:'scheduled', createdAt:'2026-07-30'                          },
  { id:'an4', title:'Staff Training Webinar',          message:'Mandatory webinar for all staff on Aug 10.',                      target:'staff',  status:'draft',     createdAt:'2026-07-29'                          },
];

export const SUPPORT_TICKETS: SupportTicket[] = [
  { id:'tkt-001', subject:'Payment not processing',       requesterName:'Carlos Mendez',  requesterEmail:'carlos@picklepro.com',  category:'billing',   priority:'urgent', status:'open',        createdAt:'2026-08-01', updatedAt:'2026-08-01' },
  { id:'tkt-002', subject:'Cannot add new staff account', requesterName:'Diana Reyes',    requesterEmail:'diana@smasharena.com',  category:'technical', priority:'high',   status:'in_progress', createdAt:'2026-07-31', updatedAt:'2026-08-01' },
  { id:'tkt-003', subject:'Subscription upgrade request', requesterName:'Eduardo Santos', requesterEmail:'eduardo@netrally.com',  category:'billing',   priority:'medium', status:'resolved',    createdAt:'2026-07-28', updatedAt:'2026-07-30' },
  { id:'tkt-004', subject:'How to export reports?',       requesterName:'Fiona Cruz',     requesterEmail:'fiona@acesports.com',   category:'general',   priority:'low',    status:'closed',      createdAt:'2026-07-25', updatedAt:'2026-07-26' },
  { id:'tkt-005', subject:'Account suspension appeal',    requesterName:'Fiona Cruz',     requesterEmail:'fiona@acesports.com',   category:'account',   priority:'high',   status:'open',        createdAt:'2026-08-01', updatedAt:'2026-08-01' },
];

export const PAYMENT_GATEWAYS: PaymentGateway[] = [
  { id:'pg1', name:'GCash',       provider:'GCash / Mynt',    status:'active',   transactionFee:1.5, currency:'PHP', lastTested:'2026-08-01' },
  { id:'pg2', name:'Maya',        provider:'PayMaya',         status:'active',   transactionFee:2.0, currency:'PHP', lastTested:'2026-07-30' },
  { id:'pg3', name:'Stripe',      provider:'Stripe Inc.',     status:'testing',  transactionFee:2.9, currency:'USD', lastTested:'2026-07-28' },
  { id:'pg4', name:'Bank Transfer',provider:'BDO / BPI',     status:'active',   transactionFee:0.0, currency:'PHP', lastTested:'2026-07-25' },
  { id:'pg5', name:'Cash on Site', provider:'Manual',         status:'active',   transactionFee:0.0, currency:'PHP', lastTested:'2026-08-01' },
];

export const REVIEWS: Review[] = [
  { id:'rv1', facilityName:'PicklePro Cebu',     reviewerName:'Juan dela Cruz',    rating:5, comment:'Great courts, very clean and well-maintained!',           status:'published', createdAt:'2026-07-29' },
  { id:'rv2', facilityName:'Smash Arena Manila',  reviewerName:'Maria Santos',      rating:4, comment:'Good facility but parking is limited.',                   status:'published', createdAt:'2026-07-28' },
  { id:'rv3', facilityName:'Net & Rally Davao',   reviewerName:'Pedro Reyes',       rating:3, comment:'Average experience, courts need more lighting.',           status:'published', createdAt:'2026-07-27' },
  { id:'rv4', facilityName:'Ace Sports Iloilo',   reviewerName:'Ana Gonzales',      rating:1, comment:'Staff was rude and courts were dirty. Terrible place!',   status:'flagged',   createdAt:'2026-07-25' },
  { id:'rv5', facilityName:'PicklePro Cebu',      reviewerName:'Jose Rizal',        rating:5, comment:'Best pickleball courts in the city! Highly recommended.', status:'published', createdAt:'2026-07-22' },
];

export const PLATFORM_FEATURES: PlatformFeature[] = [
  { id:'f1', name:'Online Booking',     description:'Allow users to book courts online',         enabled:true,  plan:'all',        category:'booking'       },
  { id:'f2', name:'Recurring Bookings', description:'Enable weekly/monthly recurring schedules', enabled:true,  plan:'pro',        category:'booking'       },
  { id:'f3', name:'GCash Payments',     description:'Accept GCash mobile payments',              enabled:true,  plan:'all',        category:'payment'       },
  { id:'f4', name:'Revenue Analytics',  description:'Advanced revenue charts and forecasting',   enabled:true,  plan:'pro',        category:'analytics'     },
  { id:'f5', name:'SMS Notifications',  description:'Send booking confirmations via SMS',        enabled:false, plan:'pro',        category:'communication' },
  { id:'f6', name:'Two-Factor Auth',    description:'Require 2FA for owner/staff accounts',      enabled:true,  plan:'enterprise', category:'security'      },
  { id:'f7', name:'Multi-Court View',   description:'View all courts in a single calendar',      enabled:true,  plan:'pro',        category:'booking'       },
  { id:'f8', name:'Data Export',        description:'Export bookings and reports as CSV/PDF',     enabled:true,  plan:'pro',        category:'analytics'     },
];

export const BACKUP_ENTRIES: BackupEntry[] = [
  { id:'bk1', label:'Auto Backup – Aug 1 02:00',  type:'auto',   size:'48.2 MB', status:'completed',  createdAt:'2026-08-01 02:00' },
  { id:'bk2', label:'Manual Backup – Jul 31',     type:'manual', size:'47.8 MB', status:'completed',  createdAt:'2026-07-31 15:30' },
  { id:'bk3', label:'Auto Backup – Jul 31 02:00', type:'auto',   size:'47.5 MB', status:'completed',  createdAt:'2026-07-31 02:00' },
  { id:'bk4', label:'Auto Backup – Jul 30 02:00', type:'auto',   size:'47.1 MB', status:'failed',     createdAt:'2026-07-30 02:00' },
  { id:'bk5', label:'Auto Backup – Jul 29 02:00', type:'auto',   size:'46.9 MB', status:'completed',  createdAt:'2026-07-29 02:00' },
];

export const PLATFORM_USERS: PlatformUser[] = [
  // PicklePro Cebu (fac-1)
  { id:'pu-01', name:'Juan dela Cruz',     email:'juan@email.com',       phone:'+63 917 123 4567', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-01-15', totalBookings:8,  totalSpent:3360, status:'active'  },
  { id:'pu-02', name:'Maria Santos',       email:'maria@email.com',      phone:'+63 918 234 5678', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-02-20', totalBookings:5,  totalSpent:2100, status:'active'  },
  { id:'pu-03', name:'Pedro Reyes',        email:'pedro@email.com',      phone:'+63 919 345 6789', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-03-05', totalBookings:3,  totalSpent:1260, status:'active'  },
  { id:'pu-04', name:'Ana Gonzales',       email:'ana@email.com',        phone:'+63 912 456 7890', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-01-30', totalBookings:12, totalSpent:5040, status:'active'  },
  { id:'pu-05', name:'Jose Rizal',         email:'jose@email.com',       phone:'+63 915 567 8901', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-04-10', totalBookings:2,  totalSpent:420,  status:'active'  },
  { id:'pu-06', name:'Emilio Aguinaldo',   email:'emilio@email.com',     phone:'+63 920 789 0123', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-05-01', totalBookings:1,  totalSpent:210,  status:'flagged' },
  { id:'pu-07', name:'Apolinario Mabini',  email:'apolinario@email.com', phone:'+63 922 901 2345', facilityId:'fac-1', facilityName:'PicklePro Cebu',     joinedDate:'2026-01-08', totalBookings:6,  totalSpent:2520, status:'banned'  },
  // Smash Arena Manila (fac-2 equivalent)
  { id:'pu-08', name:'Liza Reyes',         email:'liza@email.com',       phone:'+63 917 300 1001', facilityId:'t2',    facilityName:'Smash Arena Manila', joinedDate:'2025-12-01', totalBookings:15, totalSpent:9750, status:'active'  },
  { id:'pu-09', name:'Mark Torres',        email:'mark@email.com',       phone:'+63 918 300 1002', facilityId:'t2',    facilityName:'Smash Arena Manila', joinedDate:'2026-01-10', totalBookings:9,  totalSpent:5850, status:'active'  },
  { id:'pu-10', name:'Claire Uy',          email:'claire@email.com',     phone:'+63 919 300 1003', facilityId:'t2',    facilityName:'Smash Arena Manila', joinedDate:'2026-02-14', totalBookings:4,  totalSpent:2600, status:'active'  },
  { id:'pu-11', name:'Ryan Lim',           email:'ryan@email.com',       phone:'+63 920 300 1004', facilityId:'t2',    facilityName:'Smash Arena Manila', joinedDate:'2026-03-18', totalBookings:2,  totalSpent:1300, status:'flagged' },
  // Net & Rally Davao (t3)
  { id:'pu-12', name:'Cris Villanueva',    email:'cris@email.com',       phone:'+63 921 400 2001', facilityId:'t3',    facilityName:'Net & Rally Davao',  joinedDate:'2026-04-01', totalBookings:3,  totalSpent:900,  status:'active'  },
  { id:'pu-13', name:'Nena Flores',        email:'nena@email.com',       phone:'+63 922 400 2002', facilityId:'t3',    facilityName:'Net & Rally Davao',  joinedDate:'2026-05-15', totalBookings:1,  totalSpent:300,  status:'active'  },
  { id:'pu-14', name:'Ricky Bautista',     email:'ricky@email.com',      phone:'+63 923 400 2003', facilityId:'t3',    facilityName:'Net & Rally Davao',  joinedDate:'2026-06-10', totalBookings:0,  totalSpent:0,    status:'active'  },
];

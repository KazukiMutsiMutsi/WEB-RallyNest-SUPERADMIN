export type AdminPage =
  | 'dashboard'
  | 'bookings'
  | 'courts'
  | 'users'
  | 'staff'
  | 'reports'
  | 'settings'
  | 'admins'
  | 'super-users'
  | 'tenants'
  | 'owners'
  | 'subscriptions'
  | 'global-dashboard'
  | 'revenue'
  | 'announcements'
  | 'support'
  | 'platform-analytics'
  | 'security'
  | 'platform-settings'
  | 'payment-gateways'
  | 'platform-reports'
  | 'reviews'
  | 'features'
  | 'backup';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
  facilityId?: string; // only set for role === 'admin'
  facilityName?: string;
}

// In-memory account stores (shared across contexts via module scope)
export interface ManagedAdmin {
  id: string;
  name: string;
  email: string;
  password: string;
  facilityName: string;
  facilityId: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface ManagedStaff {
  id: string;
  name: string;
  email: string;
  password: string;
  facilityId: string;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type BookingStatus =
  | 'confirmed'
  | 'pending'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'reschedule_requested';

export interface AdminBooking {
  id: string;
  playerName: string;
  playerPhone: string;
  courtId: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationHrs: number;
  amount: number;
  paid: boolean;
  status: BookingStatus;
}

export interface AdminCourt {
  id: string;
  name: string;
  location: string;
  type: 'Indoor' | 'Outdoor' | 'Covered';
  pricePerHour: number;
  active: boolean;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'banned' | 'flagged';
}

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  lastLogin: string;
  status: 'active' | 'suspended';
  totalActions: number;
}

export interface AuditEntry {
  id: string;
  staffName: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Tenant {
  id: string;
  facilityName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'pending';
  courtsCount: number;
  joinedDate: string;
  monthlyRevenue: number;
}

export interface OwnerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  facilitiesCount: number;
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  totalRevenue: number;
  plan: 'starter' | 'pro' | 'enterprise';
}

export interface Subscription {
  id: string;
  tenantName: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  amount: number;
  billingCycle: 'monthly' | 'annual';
  nextBillingDate: string;
  startDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: 'all' | 'owners' | 'users' | 'staff';
  status: 'published' | 'draft' | 'scheduled';
  createdAt: string;
  publishedAt?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  requesterName: string;
  requesterEmail: string;
  category: 'billing' | 'technical' | 'account' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'testing';
  transactionFee: number;
  currency: string;
  lastTested: string;
}

export interface Review {
  id: string;
  facilityName: string;
  reviewerName: string;
  rating: number;
  comment: string;
  status: 'published' | 'flagged' | 'removed';
  createdAt: string;
}

export interface PlatformFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  plan: 'all' | 'pro' | 'enterprise';
  category: 'booking' | 'payment' | 'analytics' | 'communication' | 'security';
}

export interface BackupEntry {
  id: string;
  label: string;
  type: 'auto' | 'manual';
  size: string;
  status: 'completed' | 'failed' | 'in_progress';
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  facilityId: string;
  facilityName: string;
  joinedDate: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'banned' | 'flagged';
}

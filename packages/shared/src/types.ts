export type UserRole =
  | 'super_admin'
  | 'company_admin'
  | 'branch_manager'
  | 'driver'
  | 'customer'
  | 'enterprise_user';

export type CompanyStatus = 'active' | 'suspended' | 'pending' | 'deleted';

export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise';

export type DriverStatus = 'active' | 'offline' | 'on_duty' | 'suspended' | 'on_leave';

export type VehicleType = 'bike' | 'van' | 'mini_truck' | 'truck';

export type ShipmentType = 'standard' | 'express' | 'same_day' | 'next_day' | 'international';

export type ShipmentStatus =
  | 'created'
  | 'assigned'
  | 'picked_up'
  | 'warehouse'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'failed_delivery'
  | 'returned'
  | 'cancelled';

export type PickupStatus = 'requested' | 'assigned' | 'picked_up' | 'completed';

export type PodMethod = 'otp' | 'signature' | 'photo' | 'qr' | 'barcode';

export type NotificationChannel = 'sms' | 'email' | 'whatsapp' | 'push';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TenantContext {
  companyId: string | null;
  branchId: string | null;
  userId: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId?: string | null;
  branchId?: string | null;
  iat?: number;
  exp?: number;
}

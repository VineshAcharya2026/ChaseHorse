import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const otpLoginSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6).optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().min(10).optional(),
});

export const companySchema = z.object({
  name: z.string().min(2),
  gstNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  subscriptionTier: z.enum(['free', 'starter', 'professional', 'enterprise']).default('starter'),
});

export const branchSchema = z.object({
  name: z.string().min(2),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  phone: z.string().optional(),
  managerId: z.string().uuid().optional(),
});

export const driverSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  licenseNumber: z.string().min(5),
  vehicleId: z.string().uuid().optional(),
  branchId: z.string().uuid(),
});

export const vehicleSchema = z.object({
  type: z.enum(['bike', 'van', 'mini_truck', 'truck']),
  registrationNumber: z.string().min(5),
  model: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  gpsDeviceId: z.string().optional(),
  branchId: z.string().uuid(),
});

export const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10),
  type: z.enum(['individual', 'enterprise']).default('individual'),
  companyId: z.string().uuid().optional(),
});

export const addressSchema = z.object({
  name: z.string(),
  phone: z.string(),
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  country: z.string().default('IN'),
});

export const shipmentSchema = z.object({
  type: z.enum(['standard', 'express', 'same_day', 'next_day', 'international']),
  sender: addressSchema,
  receiver: addressSchema,
  weight: z.number().positive(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  description: z.string().optional(),
  branchId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
});

export const pickupSchema = z.object({
  shipmentId: z.string().uuid().optional(),
  scheduledAt: z.string().datetime().optional(),
  address: addressSchema,
  instant: z.boolean().default(false),
});

export const podSchema = z.object({
  shipmentId: z.string().uuid(),
  method: z.enum(['otp', 'signature', 'photo', 'qr', 'barcode']),
  otp: z.string().optional(),
  signatureData: z.string().optional(),
  photoUrl: z.string().optional(),
  qrCode: z.string().optional(),
  barcode: z.string().optional(),
});

export const webhookSubscriptionSchema = z.object({
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(16).optional(),
});

export const supportTicketSchema = z.object({
  subject: z.string().min(5),
  description: z.string().min(10),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  category: z.string().optional(),
});

export const workflowSchema = z.object({
  name: z.string().min(2),
  trigger: z.string(),
  steps: z.array(
    z.object({
      action: z.string(),
      config: z.record(z.unknown()),
    }),
  ),
  enabled: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type BranchInput = z.infer<typeof branchSchema>;
export type DriverInput = z.infer<typeof driverSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type ShipmentInput = z.infer<typeof shipmentSchema>;
export type PickupInput = z.infer<typeof pickupSchema>;
export type PodInput = z.infer<typeof podSchema>;

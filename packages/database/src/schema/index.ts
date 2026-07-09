import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const timestamps = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
};

export const companies = sqliteTable('companies', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  gstNumber: text('gst_number'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  pincode: text('pincode'),
  phone: text('phone'),
  email: text('email'),
  logoUrl: text('logo_url'),
  subscriptionTier: text('subscription_tier').notNull().default('starter'),
  status: text('status').notNull().default('active'),
  ...timestamps,
});

export const branches = sqliteTable('branches', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  phone: text('phone'),
  managerId: text('manager_id'),
  ...timestamps,
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  passwordHash: text('password_hash'),
  name: text('name').notNull(),
  role: text('role').notNull().default('customer'),
  mfaEnabled: integer('mfa_enabled', { mode: 'boolean' }).default(false),
  mfaSecret: text('mfa_secret'),
  mfaBackupCodes: text('mfa_backup_codes'),
  oauthProvider: text('oauth_provider'),
  oauthId: text('oauth_id'),
  avatarUrl: text('avatar_url'),
  lastLoginAt: text('last_login_at'),
  lastLoginIp: text('last_login_ip'),
  ...timestamps,
});

export const userCompanyRoles = sqliteTable('user_company_roles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id').references(() => branches.id),
  role: text('role').notNull(),
  ...timestamps,
});

export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  tokenHash: text('token_hash').notNull(),
  deviceInfo: text('device_info'),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const drivers = sqliteTable('drivers', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id')
    .notNull()
    .references(() => branches.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  licenseNumber: text('license_number').notNull(),
  aadhaarHash: text('aadhaar_hash'),
  panHash: text('pan_hash'),
  vehicleId: text('vehicle_id'),
  status: text('status').notNull().default('offline'),
  rating: real('rating').default(5),
  totalDeliveries: integer('total_deliveries').default(0),
  ...timestamps,
});

export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id')
    .notNull()
    .references(() => branches.id),
  type: text('type').notNull(),
  registrationNumber: text('registration_number').notNull(),
  model: text('model'),
  insuranceExpiry: text('insurance_expiry'),
  gpsDeviceId: text('gps_device_id'),
  maintenanceLog: text('maintenance_log'),
  ...timestamps,
});

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  companyId: text('company_id').references(() => companies.id),
  userId: text('user_id').references(() => users.id),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),
  type: text('type').notNull().default('individual'),
  addressBook: text('address_book'),
  ...timestamps,
});

export const shipments = sqliteTable('shipments', {
  id: text('id').primaryKey(),
  awbNumber: text('awb_number').notNull().unique(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id')
    .notNull()
    .references(() => branches.id),
  customerId: text('customer_id').references(() => customers.id),
  driverId: text('driver_id').references(() => drivers.id),
  type: text('type').notNull().default('standard'),
  status: text('status').notNull().default('created'),
  sender: text('sender').notNull(),
  receiver: text('receiver').notNull(),
  weight: real('weight').notNull(),
  length: real('length'),
  width: real('width'),
  height: real('height'),
  description: text('description'),
  price: real('price'),
  gstAmount: real('gst_amount'),
  totalAmount: real('total_amount'),
  assignedAt: text('assigned_at'),
  pickedUpAt: text('picked_up_at'),
  deliveredAt: text('delivered_at'),
  ...timestamps,
});

export const shipmentEvents = sqliteTable('shipment_events', {
  id: text('id').primaryKey(),
  shipmentId: text('shipment_id')
    .notNull()
    .references(() => shipments.id),
  status: text('status').notNull(),
  location: text('location'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  actorId: text('actor_id'),
  notes: text('notes'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const pickups = sqliteTable('pickups', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id')
    .notNull()
    .references(() => branches.id),
  shipmentId: text('shipment_id').references(() => shipments.id),
  driverId: text('driver_id').references(() => drivers.id),
  status: text('status').notNull().default('requested'),
  scheduledAt: text('scheduled_at'),
  address: text('address').notNull(),
  instant: integer('instant', { mode: 'boolean' }).default(false),
  ...timestamps,
});

export const proofOfDelivery = sqliteTable('proof_of_delivery', {
  id: text('id').primaryKey(),
  shipmentId: text('shipment_id')
    .notNull()
    .references(() => shipments.id),
  method: text('method').notNull(),
  otpHash: text('otp_hash'),
  signatureUrl: text('signature_url'),
  photoUrl: text('photo_url'),
  qrCode: text('qr_code'),
  barcode: text('barcode'),
  deliveredBy: text('delivered_by'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const warehouses = sqliteTable('warehouses', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  branchId: text('branch_id')
    .notNull()
    .references(() => branches.id),
  name: text('name').notNull(),
  address: text('address').notNull(),
  capacity: integer('capacity').notNull().default(1000),
  currentCount: integer('current_count').default(0),
  ...timestamps,
});

export const warehouseParcels = sqliteTable('warehouse_parcels', {
  id: text('id').primaryKey(),
  warehouseId: text('warehouse_id')
    .notNull()
    .references(() => warehouses.id),
  shipmentId: text('shipment_id')
    .notNull()
    .references(() => shipments.id),
  shelfLocation: text('shelf_location'),
  scanType: text('scan_type').notNull(),
  scannedBy: text('scanned_by'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  shipmentId: text('shipment_id').references(() => shipments.id),
  customerId: text('customer_id').references(() => customers.id),
  invoiceNumber: text('invoice_number').notNull().unique(),
  lineItems: text('line_items').notNull(),
  subtotal: real('subtotal').notNull(),
  gstAmount: real('gst_amount').notNull(),
  total: real('total').notNull(),
  paymentStatus: text('payment_status').notNull().default('pending'),
  pdfUrl: text('pdf_url'),
  razorpayOrderId: text('razorpay_order_id'),
  ...timestamps,
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  plan: text('plan').notNull(),
  billingCycle: text('billing_cycle').notNull().default('monthly'),
  amount: real('amount').notNull(),
  razorpaySubscriptionId: text('razorpay_subscription_id'),
  status: text('status').notNull().default('active'),
  currentPeriodStart: text('current_period_start'),
  currentPeriodEnd: text('current_period_end'),
  ...timestamps,
});

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  companyId: text('company_id').references(() => companies.id),
  channel: text('channel').notNull(),
  event: text('event').notNull(),
  recipient: text('recipient').notNull(),
  subject: text('subject'),
  body: text('body').notNull(),
  status: text('status').notNull().default('pending'),
  sentAt: text('sent_at'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const integrations = sqliteTable('integrations', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  provider: text('provider').notNull(),
  status: text('status').notNull().default('pending'),
  oauthTokensEncrypted: text('oauth_tokens_encrypted'),
  syncConfig: text('sync_config'),
  lastSyncAt: text('last_sync_at'),
  ...timestamps,
});

export const webhookSubscriptions = sqliteTable('webhook_subscriptions', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  url: text('url').notNull(),
  secret: text('secret').notNull(),
  events: text('events').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  ...timestamps,
});

export const webhookDeliveries = sqliteTable('webhook_deliveries', {
  id: text('id').primaryKey(),
  subscriptionId: text('subscription_id')
    .notNull()
    .references(() => webhookSubscriptions.id),
  event: text('event').notNull(),
  payload: text('payload').notNull(),
  status: text('status').notNull().default('pending'),
  attempts: integer('attempts').default(0),
  lastAttemptAt: text('last_attempt_at'),
  responseCode: integer('response_code'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const workflows = sqliteTable('workflows', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  name: text('name').notNull(),
  trigger: text('trigger').notNull(),
  steps: text('steps').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).default(true),
  ...timestamps,
});

export const supportTickets = sqliteTable('support_tickets', {
  id: text('id').primaryKey(),
  companyId: text('company_id').references(() => companies.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  category: text('category'),
  priority: text('priority').notNull().default('medium'),
  status: text('status').notNull().default('open'),
  assignedTo: text('assigned_to'),
  ...timestamps,
});

export const supportMessages = sqliteTable('support_messages', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id')
    .notNull()
    .references(() => supportTickets.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  message: text('message').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorId: text('actor_id'),
  companyId: text('company_id'),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resourceId: text('resource_id'),
  ip: text('ip'),
  metadata: text('metadata'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const apiKeys = sqliteTable('api_keys', {
  id: text('id').primaryKey(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull(),
  keyPrefix: text('key_prefix').notNull(),
  scopes: text('scopes').notNull(),
  lastUsedAt: text('last_used_at'),
  expiresAt: text('expires_at'),
  ...timestamps,
});

export const driverLocations = sqliteTable('driver_locations', {
  id: text('id').primaryKey(),
  driverId: text('driver_id')
    .notNull()
    .references(() => drivers.id),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  heading: real('heading'),
  speed: real('speed'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const cmsAssets = sqliteTable('cms_assets', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  url: text('url').notNull(),
  folder: text('folder').notNull().default('images'),
  mimeType: text('mime_type').notNull(),
  filename: text('filename').notNull(),
  altText: text('alt_text'),
  sizeBytes: integer('size_bytes').default(0),
  uploadedBy: text('uploaded_by'),
  ...timestamps,
});

export const cmsContent = sqliteTable('cms_content', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  payload: text('payload').notNull(),
  version: integer('version').notNull().default(1),
  updatedBy: text('updated_by'),
  ...timestamps,
});

export const cmsRevisions = sqliteTable('cms_revisions', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  payload: text('payload').notNull(),
  version: integer('version').notNull(),
  updatedBy: text('updated_by'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

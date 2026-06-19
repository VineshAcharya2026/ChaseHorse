import { createDb } from './index';
import * as schema from './schema';

function generateId(): string {
  return crypto.randomUUID();
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function seedDatabase(d1: D1Database) {
  const db = createDb(d1);

  const companyId = generateId();
  const branchId = generateId();
  const superAdminId = generateId();
  const companyAdminId = generateId();
  const branchManagerId = generateId();
  const driverUserId = generateId();
  const customerUserId = generateId();
  const driverId = generateId();
  const vehicleId = generateId();
  const customerId = generateId();
  const warehouseId = generateId();

  const passwordHash = await hashPassword('Password123!');

  await db.insert(schema.companies).values({
    id: companyId,
    name: 'Demo Couriers Pvt Ltd',
    gstNumber: '29AABCU9603R1ZM',
    address: '123 Logistics Park',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+919876543210',
    email: 'admin@democouriers.com',
    subscriptionTier: 'professional',
    status: 'active',
  });

  await db.insert(schema.branches).values({
    id: branchId,
    companyId,
    name: 'Bangalore Central Hub',
    address: '456 MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560002',
    phone: '+919876543211',
  });

  const users = [
    {
      id: superAdminId,
      email: 'superadmin@chasehorse.com',
      name: 'Super Admin',
      role: 'super_admin',
      passwordHash,
    },
    {
      id: companyAdminId,
      email: 'admin@democouriers.com',
      name: 'Company Admin',
      role: 'company_admin',
      passwordHash,
    },
    {
      id: branchManagerId,
      email: 'manager@democouriers.com',
      name: 'Branch Manager',
      role: 'branch_manager',
      passwordHash,
    },
    {
      id: driverUserId,
      email: 'driver@democouriers.com',
      name: 'Raj Kumar',
      role: 'driver',
      passwordHash,
      phone: '+919876543212',
    },
    {
      id: customerUserId,
      email: 'customer@example.com',
      name: 'John Customer',
      role: 'customer',
      passwordHash,
      phone: '+919876543213',
    },
  ];

  for (const user of users) {
    await db.insert(schema.users).values(user);
  }

  await db.insert(schema.userCompanyRoles).values([
    { id: generateId(), userId: companyAdminId, companyId, role: 'company_admin' },
    {
      id: generateId(),
      userId: branchManagerId,
      companyId,
      branchId,
      role: 'branch_manager',
    },
    {
      id: generateId(),
      userId: driverUserId,
      companyId,
      branchId,
      role: 'driver',
    },
  ]);

  await db.insert(schema.vehicles).values({
    id: vehicleId,
    companyId,
    branchId,
    type: 'bike',
    registrationNumber: 'KA01AB1234',
    model: 'Honda Activa',
    insuranceExpiry: '2026-12-31',
  });

  await db.insert(schema.drivers).values({
    id: driverId,
    userId: driverUserId,
    companyId,
    branchId,
    name: 'Raj Kumar',
    email: 'driver@democouriers.com',
    phone: '+919876543212',
    licenseNumber: 'KA0120230001234',
    vehicleId,
    status: 'active',
    rating: 4.8,
    totalDeliveries: 1250,
  });

  await db.insert(schema.customers).values({
    id: customerId,
    companyId,
    userId: customerUserId,
    name: 'John Customer',
    email: 'customer@example.com',
    phone: '+919876543213',
    type: 'individual',
    addressBook: JSON.stringify([
      {
        name: 'John Customer',
        phone: '+919876543213',
        addressLine1: '789 Residency Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        country: 'IN',
      },
    ]),
  });

  await db.insert(schema.warehouses).values({
    id: warehouseId,
    companyId,
    branchId,
    name: 'Central Warehouse',
    address: '789 Industrial Area',
    capacity: 5000,
    currentCount: 0,
  });

  console.log('Database seeded successfully!');
  console.log('Demo credentials: Password123!');
  console.log('  superadmin@chasehorse.com (Super Admin)');
  console.log('  admin@democouriers.com (Company Admin)');
  console.log('  manager@democouriers.com (Branch Manager)');
  console.log('  driver@democouriers.com (Driver)');
  console.log('  customer@example.com (Customer)');
}

import { GST_RATE, PRICING_BASE_RATES, VALID_SHIPMENT_TRANSITIONS } from '@chasehorse/shared';
import type { ShipmentStatus } from '@chasehorse/shared';

export function calculateShipmentPrice(
  type: string,
  weight: number,
  distanceKm = 10,
): { subtotal: number; gstAmount: number; total: number } {
  const baseRate = PRICING_BASE_RATES[type] ?? PRICING_BASE_RATES.standard;
  const weightCharge = weight * 10;
  const distanceCharge = distanceKm * 2;
  const subtotal = baseRate + weightCharge + distanceCharge;
  const gstAmount = Math.round(subtotal * GST_RATE * 100) / 100;
  const total = Math.round((subtotal + gstAmount) * 100) / 100;
  return { subtotal, gstAmount, total };
}

export function canTransitionShipment(
  currentStatus: ShipmentStatus,
  newStatus: ShipmentStatus,
): boolean {
  const allowed = VALID_SHIPMENT_TRANSITIONS[currentStatus] ?? [];
  return allowed.includes(newStatus);
}

export function generateAwbNumber(): string {
  const prefix = 'CH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${date}-${random}`;
}

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateEtaMinutes(distanceKm: number, speedKmh = 30): number {
  const trafficFactor = 1.3;
  return Math.ceil((distanceKm / speedKmh) * 60 * trafficFactor);
}

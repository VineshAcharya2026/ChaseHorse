export const PICKUP_SLOTS = [
  { id: 'morning', label: '9:00 AM – 12:00 PM', startHour: 9, endHour: 12 },
  { id: 'afternoon', label: '12:00 PM – 3:00 PM', startHour: 12, endHour: 15 },
  { id: 'evening', label: '3:00 PM – 6:00 PM', startHour: 15, endHour: 18 },
] as const;

export type PickupSlotId = (typeof PICKUP_SLOTS)[number]['id'];

export function validatePickupSlot(scheduledAt: string): { valid: boolean; slotId?: string; error?: string } {
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid scheduledAt date' };
  }
  const hour = date.getHours();
  const slot = PICKUP_SLOTS.find((s) => hour >= s.startHour && hour < s.endHour);
  if (!slot) {
    return { valid: false, error: 'Scheduled time must fall within a pickup slot (9–18)' };
  }
  return { valid: true, slotId: slot.id };
}

export function slotLabelForDate(scheduledAt: string): string {
  const hour = new Date(scheduledAt).getHours();
  const slot = PICKUP_SLOTS.find((s) => hour >= s.startHour && hour < s.endHour);
  return slot?.label ?? scheduledAt;
}

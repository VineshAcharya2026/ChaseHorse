import { assertTenantAccess } from '@chasehorse/core';
import type { UserRole } from '@chasehorse/shared';
import type { Context } from 'hono';
import type { Env, Variables } from '../types';

export function getTenantContext(c: Context<{ Bindings: Env; Variables: Variables }>) {
  return {
    userId: c.get('userId'),
    role: c.get('userRole') as UserRole,
    companyId: c.get('companyId'),
    branchId: c.get('branchId'),
  };
}

export function enforceTenant(
  c: Context<{ Bindings: Env; Variables: Variables }>,
  resourceCompanyId: string,
  resourceBranchId?: string | null,
): void {
  const ctx = getTenantContext(c);
  assertTenantAccess(
    { userId: ctx.userId, role: ctx.role, companyId: ctx.companyId, branchId: ctx.branchId },
    resourceCompanyId,
    resourceBranchId,
  );
}

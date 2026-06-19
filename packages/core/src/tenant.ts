import type { TenantContext, UserRole } from '@chasehorse/shared';

export function assertTenantAccess(
  ctx: TenantContext,
  resourceCompanyId: string,
  resourceBranchId?: string | null,
): void {
  if (ctx.role === 'super_admin') return;

  if (!ctx.companyId || ctx.companyId !== resourceCompanyId) {
    throw new Error('Forbidden: tenant access denied');
  }

  if (
    ctx.role === 'branch_manager' &&
    resourceBranchId &&
    ctx.branchId &&
    ctx.branchId !== resourceBranchId
  ) {
    throw new Error('Forbidden: branch access denied');
  }
}

export function canAccessRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export const ROLE_ROUTES: Record<UserRole, string> = {
  super_admin: '/admin',
  company_admin: '/company',
  branch_manager: '/branch',
  driver: '/driver',
  customer: '/portal',
  enterprise_user: '/enterprise',
};

export function getDefaultRoute(role: UserRole): string {
  return ROLE_ROUTES[role] ?? '/portal';
}

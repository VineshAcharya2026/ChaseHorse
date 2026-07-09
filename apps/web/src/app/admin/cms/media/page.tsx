'use client';

import { api, useAuthStore } from '@chasehorse/auth-client';
import { AuthGuard } from '@/components/auth/auth-guard';
import { PageHeader } from '@/components/dashboard/kpi-card';
import { MediaGrid } from '@/components/cms/media-grid';

export default function CmsMediaPage() {
  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <MediaContent />
    </AuthGuard>
  );
}

function MediaContent() {
  const { accessToken } = useAuthStore();
  api.setToken(accessToken);

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload and manage images. Copy a URL to reuse it anywhere, or replace an image in place."
      />
      <MediaGrid folder="images" />
    </div>
  );
}

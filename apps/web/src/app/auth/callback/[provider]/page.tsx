import { Suspense } from 'react';
import OAuthCallbackClient from './oauth-callback-client';

export function generateStaticParams() {
  return [{ provider: 'google' }, { provider: 'microsoft' }, { provider: 'linkedin' }];
}

export default async function OAuthCallbackPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-brand/20" />
        </div>
      }
    >
      <OAuthCallbackClient provider={provider} />
    </Suspense>
  );
}

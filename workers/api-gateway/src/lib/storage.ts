import type { R2Bucket } from '@cloudflare/workers-types';

export async function uploadFile(
  bucket: R2Bucket | undefined,
  key: string,
  data: ArrayBuffer | Uint8Array | string,
  contentType: string,
): Promise<string> {
  if (!bucket) throw new Error('R2 storage not configured');
  await bucket.put(key, data, {
    httpMetadata: { contentType },
  });
  return key;
}

export async function uploadBase64Image(
  bucket: R2Bucket | undefined,
  key: string,
  base64: string,
  contentType = 'image/png',
): Promise<string> {
  if (!bucket) throw new Error('R2 storage not configured');
  const raw = base64.includes(',') ? base64.split(',')[1]! : base64;
  const binary = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  return uploadFile(bucket, key, binary, contentType);
}

export function publicStorageUrl(baseUrl: string, key: string): string {
  return `${baseUrl}/api/files/${encodeURIComponent(key)}`;
}

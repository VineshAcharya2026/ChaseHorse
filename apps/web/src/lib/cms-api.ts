import { api } from '@chasehorse/auth-client';

export interface CmsAsset {
  id: string;
  key: string;
  url: string;
  folder: string;
  mimeType: string;
  filename: string;
  altText: string | null;
  sizeBytes: number;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function listAssets(folder?: string) {
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : '';
  const res = await api.get<{ success: boolean; data: { items: CmsAsset[]; total: number } }>(
    `/api/cms/assets${qs}`,
  );
  return res.data;
}

export async function uploadAsset(file: File, folder = 'images', altText?: string) {
  const data = await fileToBase64(file);
  const res = await api.post<{ success: boolean; data: CmsAsset }>('/api/cms/assets', {
    data,
    filename: file.name,
    folder,
    contentType: file.type || 'image/png',
    altText,
  });
  return res.data;
}

export async function replaceAsset(id: string, file: File) {
  const data = await fileToBase64(file);
  const res = await api.post<{ success: boolean; data: CmsAsset }>(`/api/cms/assets/${id}/replace`, {
    data,
    contentType: file.type || 'image/png',
    filename: file.name,
  });
  return res.data;
}

export async function updateAsset(id: string, body: { altText?: string; filename?: string }) {
  const res = await api.put<{ success: boolean; data: CmsAsset }>(`/api/cms/assets/${id}`, body);
  return res.data;
}

export async function deleteAsset(id: string) {
  await api.delete(`/api/cms/assets/${id}`);
}

export async function getContent<T = unknown>() {
  const res = await api.get<{ success: boolean; data: T | null; version?: number }>(
    '/api/cms/content',
  );
  return res;
}

export async function saveContent(payload: unknown) {
  const res = await api.put<{ success: boolean; data: { version: number } }>('/api/cms/content', {
    payload,
  });
  return res.data;
}

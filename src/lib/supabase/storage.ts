export const STORAGE_BUCKETS = {
  vendorAssets: "vendor-assets",
} as const;

export function publicStorageUrl(bucket: string, path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return "";
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

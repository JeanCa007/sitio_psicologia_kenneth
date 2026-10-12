import { supabase } from "@/lib/supabase";

export const MEDIA_BUCKET = "media";

const MAX_SIZE_MB = 5;
export const MAX_IMAGE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function sanitizeFileName(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const ext = dotIndex > 0 ? name.slice(dotIndex + 1) : "";
  const cleanBase =
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "imagen";
  const cleanExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) || "jpg";
  return `${cleanBase}.${cleanExt}`;
}

export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("type");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("size");
  }
  const path = `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
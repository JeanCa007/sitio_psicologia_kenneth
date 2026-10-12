import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MAX_IMAGE_BYTES, uploadImage } from "@/lib/storage";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  hint?: string;
  folder?: string;
  previewClass?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  hint,
  folder = "uploads",
  previewClass = "w-28 h-36",
  className = "",
}: ImageUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError(t("admin.common.imageTypeError"));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(t("admin.common.imageSizeError"));
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch {
      setError(t("admin.common.imageUploadError"));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <span className="block text-sm font-semibold text-foreground-800 mb-1.5">{label}</span>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className={`${previewClass} shrink-0 rounded-lg overflow-hidden bg-background-100 border border-background-200/70`}>
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover object-top" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-foreground-300 text-3xl">
              <i className="ri-image-line" />
            </span>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePick}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap disabled:opacity-60 dark:text-foreground-950"
            >
              <i className={uploading ? "ri-loader-4-line animate-spin" : "ri-upload-2-line"} />
              {uploading ? t("admin.common.uploading") : value ? t("admin.common.changeImage") : t("admin.common.uploadImage")}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setError("");
                }}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-md border border-background-300 px-4 py-2.5 text-sm font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap disabled:opacity-60"
              >
                <i className="ri-delete-bin-line" />
                {t("admin.common.removeImage")}
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-foreground-400">{hint ?? t("admin.common.imageHint")}</p>
          {error && (
            <p className="mt-2 rounded-md bg-accent-100 px-3 py-2 text-xs text-accent-900">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
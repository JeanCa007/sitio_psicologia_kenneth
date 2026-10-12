import { useState } from "react";
import { useTranslation } from "react-i18next";

interface CopyFieldProps {
  label: string;
  value: string;
}

export default function CopyField({ label, value }: CopyFieldProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-background-50 border border-background-200/80 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs text-foreground-500">{label}</p>
        <p className="mt-0.5 font-heading text-sm md:text-base font-semibold text-foreground-950 break-words">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-md border border-primary-300 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 cursor-pointer whitespace-nowrap transition-colors shrink-0"
      >
        <i className={copied ? "ri-check-line" : "ri-file-copy-line"} />
        {copied ? t("payment.copied") : t("payment.copy")}
      </button>
    </div>
  );
}
import { useTranslation } from "react-i18next";

export function useLang(): "es" | "en" {
  const { i18n } = useTranslation();
  return i18n.language && i18n.language.startsWith("en") ? "en" : "es";
}

export function pickLocalized<T extends Record<string, unknown>>(
  row: T,
  base: string,
  lang: string,
): string {
  const value = row[`${base}_${lang}`] ?? row[`${base}_es`] ?? "";
  return typeof value === "string" ? value : "";
}

export function pickArray<T extends Record<string, unknown>>(
  row: T,
  base: string,
  lang: string,
): string[] {
  const value = row[`${base}_${lang}`] ?? row[`${base}_es`] ?? [];
  return Array.isArray(value) ? (value as string[]) : [];
}
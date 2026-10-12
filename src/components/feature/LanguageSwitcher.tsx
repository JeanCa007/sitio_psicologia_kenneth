import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  const current = i18n.language.startsWith("en") ? "en" : "es";

  const change = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-background-100 p-1 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      {(["es", "en"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => change(lang)}
          className={`px-3 py-1 rounded-full font-semibold cursor-pointer whitespace-nowrap transition-colors ${
            current === lang
              ? "bg-primary-500 text-background-50 dark:text-foreground-950"
              : "text-foreground-600 hover:text-primary-700"
          }`}
          aria-label={lang === "es" ? "Español" : "English"}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
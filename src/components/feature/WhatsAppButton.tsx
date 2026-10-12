import { useTranslation } from "react-i18next";
import { useSite } from "@/context/SiteContext";

export default function WhatsAppButton() {
  const { t } = useTranslation();
  const { identity } = useSite();

  return (
    <a
      href={`https://wa.me/${identity.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 md:bottom-8 md:right-8 z-40 inline-flex items-center gap-2 rounded-full bg-secondary-500 px-4 py-3 text-background-50 hover:bg-secondary-600 cursor-pointer transition-colors dark:text-foreground-950"
      aria-label={t("nav.whatsapp")}
    >
      <i className="ri-whatsapp-line text-2xl" />
      <span className="hidden sm:block text-sm font-semibold whitespace-nowrap">
        {t("common.whatsappCta")}
      </span>
    </a>
  );
}
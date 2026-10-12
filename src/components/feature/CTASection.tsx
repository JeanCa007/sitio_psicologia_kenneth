import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSite } from "@/context/SiteContext";

export default function CTASection() {
  const { t } = useTranslation();
  const { identity } = useSite();

  return (
    <section className="w-full px-4 md:px-8 py-12 md:py-20">
      <div className="mx-auto w-full rounded-lg bg-primary-500 px-6 py-10 md:px-14 md:py-16 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold text-background-50 leading-tight">
          {t("cta.title")}
        </h2>
        <p className="mt-3 mx-auto max-w-xl text-sm md:text-base text-background-50/90 leading-relaxed">
          {t("cta.text")}
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/reservar"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-background-50 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-background-100 cursor-pointer whitespace-nowrap transition-colors"
          >
            <i className="ri-calendar-check-line" />
            {t("common.bookCta")}
          </Link>
          <a
            href={`https://wa.me/${identity.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-background-50/70 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-background-50/10 cursor-pointer whitespace-nowrap transition-colors"
          >
            <i className="ri-whatsapp-line" />
            {t("common.whatsappCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
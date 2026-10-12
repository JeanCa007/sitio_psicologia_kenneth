import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/feature/SectionHeading";
import ServiceCard from "@/components/feature/ServiceCard";
import CTASection from "@/components/feature/CTASection";
import { useServices } from "@/hooks/useSiteData";
import { pickLocalized, useLang } from "@/hooks/useLang";
import { labelOf, serviceCategoryLabels } from "@/lib/labels";
import { formatCrc, formatDuration, formatUsd } from "@/lib/format";

const categoryKeys = ["todos", "terapia", "crisis", "psicopedagogia", "diagnostico"];

export default function Servicios() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: services, error, reload } = useServices();
  const [active, setActive] = useState("todos");
  const filtered = active === "todos" ? services : services.filter((s) => s.category === active);

  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow={t("services.eyebrow")} title={t("services.title")} description={t("services.desc")} align="left" />
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          {error && (
            <div className="mb-6 rounded-lg bg-accent-100 px-4 py-3 text-sm text-accent-900 flex items-center justify-between gap-3">
              <span>{t("common.errorLoad")}</span>
              <button type="button" onClick={reload} className="rounded-md bg-accent-500 px-3 py-1.5 text-xs font-semibold text-background-50 cursor-pointer whitespace-nowrap">
                {t("common.retry")}
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {categoryKeys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                  active === key
                    ? "bg-primary-500 text-background-50 dark:text-foreground-950"
                    : "bg-background-100 text-foreground-700 hover:bg-primary-100"
                }`}
              >
                {key === "todos" ? t("services.all") : labelOf(serviceCategoryLabels, key, lang)}
              </button>
            ))}
          </div>

          <div data-product-shop className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filtered.map((service) => (
              <ServiceCard
                key={service.id}
                slug={service.slug}
                name={pickLocalized(service, "name", lang)}
                category={labelOf(serviceCategoryLabels, service.category, lang)}
                short={pickLocalized(service, "short", lang)}
                icon={service.icon}
                duration={formatDuration(service.duration_min)}
                priceCrc={formatCrc(service.price_crc)}
                priceUsd={formatUsd(service.price_usd)}
              />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
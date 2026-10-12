import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ServiceCardProps {
  slug: string;
  name: string;
  category: string;
  short: string;
  icon: string;
  duration: string;
  priceCrc: string;
  priceUsd: string;
}

export default function ServiceCard({
  slug,
  name,
  category,
  short,
  icon,
  duration,
  priceCrc,
  priceUsd,
}: ServiceCardProps) {
  const { t } = useTranslation();

  return (
    <article className="group flex flex-col rounded-lg border border-background-200/80 bg-background-50 p-5 md:p-6 transition-colors hover:border-primary-300">
      <div className="flex items-start justify-between gap-3">
        <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 text-2xl">
          <i className={icon} />
        </span>
        <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-semibold text-secondary-900">
          {category}
        </span>
      </div>
      <h3 className="mt-4 font-heading text-lg font-semibold text-foreground-950">{name}</h3>
      <p className="mt-2 text-sm text-foreground-600 leading-relaxed flex-1">{short}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-foreground-500">
        <span className="inline-flex items-center gap-1.5">
          <i className="ri-time-line text-primary-600" />
          {duration}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="ri-money-dollar-circle-line text-accent-600" />
          {priceCrc} · {priceUsd}
        </span>
      </div>

      <Link
        to={`/servicios/${slug}`}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-md border border-primary-300 px-4 py-2.5 text-sm font-semibold text-primary-700 hover:bg-primary-500 hover:text-background-50 hover:border-primary-500 cursor-pointer whitespace-nowrap transition-colors dark:hover:text-foreground-950"
      >
        {t("common.viewDetail")}
        <i className="ri-arrow-right-line" />
      </Link>
    </article>
  );
}
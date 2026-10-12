import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CourseCardProps {
  id: string;
  title: string;
  type: string;
  description: string;
  modality: string;
  dateLabel: string;
  timeLabel: string;
  duration: string;
  priceCrc: string;
  priceUsd: string;
  cover: string;
}

export default function CourseCard({
  id,
  title,
  type,
  description,
  modality,
  dateLabel,
  timeLabel,
  duration,
  priceCrc,
  priceUsd,
  cover,
}: CourseCardProps) {
  const { t } = useTranslation();

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-background-200/80 bg-background-50 transition-colors hover:border-primary-300">
      <div className="relative w-full h-44 md:h-48 overflow-hidden">
        <img
          src={cover}
          alt={`${title} - charla de psicología virtual`}
          title={`${title} - psicología y psicopedagogía virtual`}
          className="w-full h-full object-cover object-top"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background-50/95 px-3 py-1 text-[11px] font-semibold text-accent-700">
          {type}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground-950 leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-sm text-foreground-600 leading-relaxed flex-1">{description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-foreground-600">
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-calendar-line text-primary-600" />
            {dateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-time-line text-primary-600" />
            {timeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-vidicon-line text-primary-600" />
            {modality}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i className="ri-hourglass-line text-primary-600" />
            {duration}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-heading text-lg font-semibold text-foreground-950">{priceCrc}</span>
            <span className="text-xs text-foreground-500">
              {priceUsd} · {t("common.plusVat")}
            </span>
          </div>
          <Link
            to={`/cursos/${id}`}
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors dark:text-foreground-950"
          >
            {t("common.viewDetail")}
            <i className="ri-arrow-right-line" />
          </Link>
        </div>
      </div>
    </article>
  );
}
import { useTranslation } from "react-i18next";
import CTASection from "@/components/feature/CTASection";
import { useSite } from "@/context/SiteContext";
import { useLang } from "@/hooks/useLang";

export default function SobreMi() {
  const { t } = useTranslation();
  const { identity } = useSite();
  const lang = useLang();

  const values = t("about.values", { returnObjects: true }) as unknown as string[];
  const credentials = t("about.credentials", { returnObjects: true }) as unknown as {
    icon: string;
    title: string;
    text: string;
  }[];
  const stats = t("stats", { returnObjects: true }) as unknown as { value: string; label: string }[];

  const title = lang === "en" ? identity.aboutTitle_en : identity.aboutTitle_es;
  const text = lang === "en" ? identity.aboutText_en : identity.aboutText_es;
  const paragraphs = text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="w-full">
      <section className="w-full px-4 md:px-8 py-12 md:py-20">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="w-full h-72 md:h-[520px] rounded-lg overflow-hidden">
            <img
              src={identity.aboutImageUrl}
              alt={t("about.photoAlt")}
              title={`${identity.therapist} · ${identity.brand}`}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div>
            <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              {t("about.eyebrow")}
            </span>
            <h1 className="mt-4 text-2xl md:text-4xl font-semibold text-foreground-950 leading-tight">
              {title}
            </h1>
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-4 text-sm md:text-base text-foreground-600 leading-relaxed">
                {paragraph}
              </p>
            ))}

            <ul className="mt-6 flex flex-wrap gap-2">
              {values.map((value) => (
                <li
                  key={value}
                  className="inline-flex items-center gap-1.5 rounded-full bg-background-100 px-3 py-1.5 text-xs font-medium text-foreground-700"
                >
                  <i className="ri-check-line text-primary-600" />
                  {value}
                </li>
              ))}
            </ul>

            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground-800">
              <i className="ri-user-star-line text-primary-600" />
              {identity.therapist}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-background-100 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="font-heading text-xl md:text-3xl font-semibold text-foreground-950">
            {t("about.credentialsTitle")}
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {credentials.map((item) => (
              <div key={item.title} className="rounded-lg bg-background-50 border border-background-200/70 p-5">
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100 text-accent-700 text-2xl">
                  <i className={item.icon} />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-foreground-600">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-heading text-2xl md:text-4xl font-semibold text-primary-700">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs md:text-sm text-foreground-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-3xl text-center">
          <h2 className="font-heading text-xl md:text-3xl font-semibold text-foreground-950">
            {t("about.approachTitle")}
          </h2>
          <p className="mt-4 text-sm md:text-base text-foreground-600 leading-relaxed">
            {t("about.approachText")}
          </p>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
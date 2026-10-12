import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/feature/SectionHeading";
import ServiceCard from "@/components/feature/ServiceCard";
import CourseCard from "@/components/feature/CourseCard";
import CTASection from "@/components/feature/CTASection";
import FaqAccordion from "@/components/feature/FaqAccordion";
import { useCourses, useServices } from "@/hooks/useSiteData";
import { useLang, pickArray, pickLocalized } from "@/hooks/useLang";
import { labelOf, serviceCategoryLabels, courseTypeLabels } from "@/lib/labels";
import { formatCrc, formatDateLong, formatDuration, formatUsd } from "@/lib/format";
import { formatTimeInZone, zonedToUtc } from "@/lib/time";
import { useSite } from "@/context/SiteContext";

const testimonialAvatars = [
  "https://readdy.ai/api/search-image?query=Warm%20friendly%20portrait%20of%20a%20Latin%20American%20woman%20in%20her%20thirties%20smiling%20softly%2C%20warm%20neutral%20background%2C%20natural%20window%20light%2C%20editorial%20photography%2C%20calm%20tones&width=200&height=200&seq=testimonial-maria-01&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Warm%20friendly%20portrait%20of%20a%20Latin%20American%20man%20in%20his%20forties%20smiling%20kindly%2C%20warm%20neutral%20background%2C%20soft%20natural%20light%2C%20editorial%20photography%2C%20calm%20tones&width=200&height=200&seq=testimonial-andres-02&orientation=squarish",
  "https://readdy.ai/api/search-image?query=Warm%20friendly%20portrait%20of%20a%20young%20Latin%20American%20woman%20smiling%20gently%2C%20warm%20neutral%20background%2C%20soft%20natural%20light%2C%20editorial%20photography%2C%20calm%20tones&width=200&height=200&seq=testimonial-daniela-03&orientation=squarish",
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const { identity } = useSite();
  const lang = useLang();
  const { data: services } = useServices();
  const { data: courses } = useCourses();

  const stats = t("stats", { returnObjects: true }) as unknown as { value: string; label: string }[];
  const howItWorks = t("howItWorks", { returnObjects: true }) as unknown as { icon: string; title: string; text: string }[];
  const features = t("features", { returnObjects: true }) as unknown as { icon: string; title: string; text: string }[];
  const testimonials = t("testimonials", { returnObjects: true }) as unknown as { name: string; role: string; text: string }[];
  const faqs = t("faqs", { returnObjects: true }) as unknown as { question: string; answer: string }[];

  const destacados = services.slice(0, 6);
  const cursosPreview = courses.slice(0, 3);
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-CR";

  return (
    <div className="w-full">
      <section className="relative w-full h-[560px] md:h-[680px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20earthy%20abstract%20wellness%20background%20with%20terracotta%20clay%2C%20golden%20honey%20and%20soft%20sage%20green%20organic%20shapes%2C%20calm%20flowing%20forms%2C%20minimal%20elegant%20editorial%20art%2C%20gentle%20light%20and%20soft%20shadows&width=1600&height=900&seq=hero-raiz-01&orientation=landscape"
          alt={`Psicología y psicopedagogía virtual - ${identity.brand}`}
          title="Psicología y psicopedagogía virtual"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/55" />
        <div className="relative z-10 mx-auto flex h-full w-full flex-col items-center justify-center px-4 md:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-background-50/15 px-4 py-1.5 text-xs md:text-sm font-medium text-background-50 backdrop-blur-sm">
            <i className="ri-vidicon-line" />
            {t("hero.badge")}
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl md:text-6xl font-semibold text-white leading-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm md:text-lg text-background-100/95 leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/reservar"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors dark:text-foreground-950"
            >
              <i className="ri-calendar-check-line" />
              {t("common.bookCta")}
            </Link>
            <a
              href={`https://wa.me/${identity.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-md border border-background-50/70 bg-background-50/10 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-background-50/20 cursor-pointer whitespace-nowrap transition-colors backdrop-blur-sm"
            >
              <i className="ri-whatsapp-line" />
              {t("common.whatsappCta")}
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm text-background-100/90">
            <span className="inline-flex items-center gap-2">
              <i className="ri-check-line text-accent-300" /> {t("hero.chip1")}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="ri-check-line text-accent-300" /> {t("hero.chip2")}
            </span>
            <span className="inline-flex items-center gap-2">
              <i className="ri-check-line text-accent-300" /> {t("hero.chip3")}
            </span>
          </div>
        </div>
      </section>

      <section className="w-full bg-background-100 border-y border-background-200/70">
        <div className="mx-auto w-full px-4 md:px-8 py-8 md:py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl md:text-4xl font-semibold text-primary-700">{stat.value}</p>
              <p className="mt-1 text-xs md:text-sm text-foreground-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow={t("home.servicesEyebrow")}
            title={t("home.servicesTitle")}
            description={t("home.servicesDesc")}
          />
          <div data-product-shop className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {destacados.map((service) => (
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
          <div className="mt-10 text-center">
            <Link
              to="/servicios"
              className="inline-flex items-center gap-2 rounded-md border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-500 hover:text-background-50 hover:border-primary-500 cursor-pointer whitespace-nowrap transition-colors dark:hover:text-foreground-950"
            >
              {t("common.viewAllServices")}
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-background-100 px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow={t("home.featuresEyebrow")} title={t("home.featuresTitle")} align="left" />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg bg-background-50 border border-background-200/70 p-5 md:p-6">
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100 text-accent-700 text-2xl">
                  <i className={feature.icon} />
                </span>
                <h3 className="mt-4 font-heading text-base md:text-lg font-semibold text-foreground-950">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow={t("home.howEyebrow")} title={t("home.howTitle")} description={t("home.howDesc")} />
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="relative rounded-lg border border-background-200/80 bg-background-50 p-6">
                <span className="absolute -top-3 left-6 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-background-50 text-xs font-bold">
                  {index + 1}
                </span>
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 text-2xl">
                  <i className={step.icon} />
                </span>
                <h3 className="mt-4 font-heading text-base md:text-lg font-semibold text-foreground-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-background-100 px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow={t("home.coursesEyebrow")}
            title={t("home.coursesTitle")}
            description={t("home.coursesDesc")}
          />
          <div data-product-shop className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {cursosPreview.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={pickLocalized(course, "title", lang)}
                type={labelOf(courseTypeLabels, course.type, lang)}
                description={pickLocalized(course, "description", lang)}
                modality={course.modality}
                dateLabel={formatDateLong(course.start_date, locale)}
                timeLabel={formatTimeInZone(zonedToUtc(course.start_date ?? "2026-01-01", course.start_time, identity.timezone), identity.timezone, locale)}
                duration={formatDuration(course.duration_min)}
                priceCrc={formatCrc(course.price_crc)}
                priceUsd={formatUsd(course.price_usd)}
                cover={course.cover_url}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 rounded-md border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-500 hover:text-background-50 hover:border-primary-500 cursor-pointer whitespace-nowrap transition-colors dark:hover:text-foreground-950"
            >
              {t("common.viewAllCourses")}
              <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow={t("home.testimonialsEyebrow")} title={t("home.testimonialsTitle")} />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {testimonials.map((item, index) => (
              <figure key={item.name} className="flex flex-col rounded-lg border border-background-200/80 bg-background-50 p-6">
                <i className="ri-double-quotes-l text-3xl text-primary-300" />
                <blockquote className="mt-3 text-sm text-foreground-700 leading-relaxed flex-1">{item.text}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <img
                      src={testimonialAvatars[index % testimonialAvatars.length]}
                      alt={`Testimonio de ${item.name}`}
                      title="Testimonio de paciente"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <p className="font-heading text-sm font-semibold text-foreground-950">{item.name}</p>
                    <p className="text-xs text-foreground-500">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-background-100 px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <SectionHeading eyebrow={t("home.faqEyebrow")} title={t("home.faqTitle")} />
          <div className="mt-10">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
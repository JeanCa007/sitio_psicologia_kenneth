import { Link } from "react-router-dom";
import SectionHeading from "@/components/feature/SectionHeading";
import CTASection from "@/components/feature/CTASection";
import { services } from "@/mocks/services";
import { courses } from "@/mocks/courses";
import { paymentInfo } from "@/mocks/siteContent";

export default function Precios() {
  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="Precios"
            title="Tarifas claras, sin sorpresas"
            description={`Sesiones desde ₡28.000 más IVA. También puedes pagar en dólares. ${paymentInfo.ivaNote}`}
            align="left"
          />
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="font-heading text-xl md:text-2xl font-semibold text-foreground-950">
            Sesiones y servicios
          </h2>
          <div className="mt-5 rounded-lg border border-background-200/80 bg-background-50 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-background-100 text-xs font-semibold uppercase tracking-wide text-foreground-500">
              <span className="col-span-6">Servicio</span>
              <span className="col-span-2">Duración</span>
              <span className="col-span-2 text-right">Colones</span>
              <span className="col-span-2 text-right">Dólares</span>
            </div>
            {services.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 md:px-6 py-5 border-t border-background-200/70"
              >
                <div className="md:col-span-6">
                  <Link
                    to={`/servicios/${service.slug}`}
                    className="font-heading text-base font-semibold text-foreground-950 hover:text-primary-700 cursor-pointer"
                  >
                    {service.name}
                  </Link>
                  <p className="mt-1 text-xs text-foreground-500 md:hidden">{service.duration}</p>
                </div>
                <span className="hidden md:flex md:col-span-2 items-center text-sm text-foreground-600">
                  {service.duration}
                </span>
                <span className="md:col-span-2 md:text-right font-heading text-base font-semibold text-foreground-950">
                  {service.priceCrc}
                </span>
                <span className="md:col-span-2 md:text-right text-sm text-foreground-600">
                  {service.priceUsd}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-foreground-500">
            Los precios no incluyen IVA. El tipo de cambio en dólares puede variar ligeramente.
          </p>

          <h2 className="mt-12 font-heading text-xl md:text-2xl font-semibold text-foreground-950">
            Cursos, charlas y capacitaciones
          </h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <div
                key={course.id}
                className="rounded-lg border border-background-200/80 bg-background-50 p-5"
              >
                <span className="inline-block rounded-full bg-accent-100 px-2.5 py-1 text-[11px] font-semibold text-accent-800">
                  {course.type}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-foreground-950 leading-snug">
                  {course.title}
                </h3>
                <p className="mt-2 text-xs text-foreground-500">{course.dateLabel}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-semibold text-primary-800">
                    {course.priceCrc}
                  </span>
                  <span className="text-sm text-foreground-600">{course.priceUsd}</span>
                </div>
                <Link
                  to={`/cursos/${course.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800 cursor-pointer"
                >
                  Ver detalle <i className="ri-arrow-right-line" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-lg bg-primary-100/70 p-6">
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-500 text-background-50 text-2xl dark:text-foreground-950">
                <i className="ri-smartphone-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                SINPE Móvil
              </h3>
              <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                Pago inmediato al {paymentInfo.sinpePhone} ({paymentInfo.sinpeName}).
              </p>
            </div>
            <div className="rounded-lg bg-secondary-100/70 p-6">
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-500 text-background-50 text-2xl dark:text-foreground-950">
                <i className="ri-bank-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                Transferencia
              </h3>
              <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                {paymentInfo.bank}. Comparte el comprobante y confirmamos tu cita.
              </p>
            </div>
            <div className="rounded-lg bg-accent-100/70 p-6">
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-500 text-background-50 text-2xl">
                <i className="ri-money-dollar-circle-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                Pagos en dólares
              </h3>
              <p className="mt-2 text-sm text-foreground-600 leading-relaxed">
                Aceptamos pagos en dólares además de colones, coordinados por WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/pago"
              className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors dark:text-foreground-950"
            >
              <i className="ri-secure-payment-line" />
              Ver formas de pago
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
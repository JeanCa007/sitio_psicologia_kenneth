import { Link, useParams } from "react-router-dom";
import CTASection from "@/components/feature/CTASection";
import { services } from "@/mocks/services";
import { siteInfo } from "@/mocks/siteContent";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="w-full px-4 md:px-8 py-24 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-background-100 text-3xl text-foreground-400">
          <i className="ri-emotion-sad-line" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold text-foreground-950">
          No encontramos este servicio
        </h1>
        <p className="mt-2 text-sm text-foreground-600">
          Puede que el enlace haya cambiado. Mira todos nuestros servicios disponibles.
        </p>
        <Link
          to="/servicios"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary-500 px-5 py-3 text-sm font-semibold text-background-50 cursor-pointer dark:text-foreground-950"
        >
          <i className="ri-arrow-left-line" />
          Ver servicios
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-6">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="flex items-center gap-2 text-xs text-foreground-500">
            <Link to="/" className="hover:text-primary-700 cursor-pointer">Inicio</Link>
            <i className="ri-arrow-right-s-line" />
            <Link to="/servicios" className="hover:text-primary-700 cursor-pointer">Servicios</Link>
            <i className="ri-arrow-right-s-line" />
            <span className="text-foreground-700">{service.category}</span>
          </nav>
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-16">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <div className="w-full h-64 md:h-[420px] rounded-lg overflow-hidden">
            <img
              src={service.image}
              alt={`${service.name} - servicio de psicología virtual`}
              title={`${service.name} - ${siteInfo.brand}`}
              className="w-full h-full object-cover object-top"
            />
          </div>

          <div className="w-full">
            <span className="inline-block rounded-full bg-secondary-100 px-3 py-1 text-xs font-semibold text-secondary-900">
              {service.category}
            </span>
            <h1 className="mt-3 text-2xl md:text-4xl font-semibold text-foreground-950 leading-tight">
              {service.name}
            </h1>
            <p className="mt-4 text-sm md:text-base text-foreground-600 leading-relaxed">
              {service.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-background-200/80 bg-background-50 p-4">
                <p className="text-xs text-foreground-500">Duración</p>
                <p className="mt-1 font-heading text-base font-semibold text-foreground-950">
                  {service.duration}
                </p>
              </div>
              <div className="rounded-lg border border-background-200/80 bg-background-50 p-4">
                <p className="text-xs text-foreground-500">Modalidad</p>
                <p className="mt-1 font-heading text-base font-semibold text-foreground-950">
                  WhatsApp / Google Meet
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-primary-100/70 p-5">
              <p className="text-xs text-foreground-600">Precio de la sesión</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-3">
                <span className="font-heading text-3xl font-semibold text-primary-800">
                  {service.priceCrc}
                </span>
                <span className="text-sm text-foreground-600">{service.priceUsd} · más IVA</span>
              </div>
              <p className="mt-2 text-xs text-foreground-600">
                Pagos por SINPE Móvil o transferencia. También aceptamos dólares.
              </p>
            </div>

            <h2 className="mt-8 font-heading text-lg font-semibold text-foreground-950">
              ¿Qué incluye?
            </h2>
            <ul className="mt-3 space-y-2">
              {service.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground-700">
                  <i className="ri-checkbox-circle-line mt-0.5 text-primary-600" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/reservar"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors dark:text-foreground-950"
              >
                <i className="ri-calendar-check-line" />
                Reservar esta sesión
              </Link>
              <a
                href={`https://wa.me/${siteInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-primary-100 cursor-pointer whitespace-nowrap transition-colors"
              >
                <i className="ri-whatsapp-line" />
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
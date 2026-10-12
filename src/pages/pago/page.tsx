import { Link } from "react-router-dom";
import SectionHeading from "@/components/feature/SectionHeading";
import CopyField from "@/components/feature/CopyField";
import { paymentInfo, siteInfo } from "@/mocks/siteContent";

const steps = [
  { icon: "ri-calendar-check-line", title: "Reserva tu cita", text: "Agenda el servicio, el día y la hora que prefieras." },
  { icon: "ri-smartphone-line", title: "Realiza el pago", text: "Paga por SINPE Móvil o transferencia bancaria." },
  { icon: "ri-upload-2-line", title: "Envía el comprobante", text: "Compártenos el comprobante por WhatsApp." },
  { icon: "ri-check-double-line", title: "Cita confirmada", text: "Te confirmamos y enviamos el enlace de la videollamada." },
];

export default function Pago() {
  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="Formas de pago"
            title="Paga fácil por SINPE Móvil o transferencia"
            description={paymentInfo.intro}
            align="left"
          />
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, index) => (
              <div key={step.title} className="relative rounded-lg border border-background-200/80 bg-background-50 p-5">
                <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-background-50 text-xs font-bold">
                  {index + 1}
                </span>
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 text-2xl">
                  <i className={step.icon} />
                </span>
                <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-background-200/80 bg-background-50 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-500 text-background-50 text-2xl dark:text-foreground-950">
                  <i className="ri-smartphone-line" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground-950">SINPE Móvil</h3>
              </div>
              <div className="mt-5 space-y-3">
                <CopyField label="Número de SINPE" value={paymentInfo.sinpePhone} />
                <CopyField label="Nombre" value={paymentInfo.sinpeName} />
              </div>
              <p className="mt-4 text-xs text-foreground-500">
                Transfiere el monto de tu sesión y guarda el comprobante.
              </p>
            </div>

            <div className="rounded-lg border border-background-200/80 bg-background-50 p-6 md:p-8">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-500 text-background-50 text-2xl dark:text-foreground-950">
                  <i className="ri-bank-line" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-foreground-950">
                  Transferencia bancaria
                </h3>
              </div>
              <div className="mt-5 space-y-3">
                <CopyField label="Banco" value={paymentInfo.bank} />
                <CopyField label="Cuenta IBAN" value={paymentInfo.bankAccount} />
                <CopyField label="Titular" value={paymentInfo.bankAccountName} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-background-100/70 border border-background-200/70 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 flex items-center justify-center rounded-lg bg-accent-100 text-accent-700 text-xl shrink-0">
                <i className="ri-money-dollar-circle-line" />
              </span>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground-950">
                  Pagos en dólares y con tarjeta (próximamente)
                </h3>
                <p className="mt-1 text-sm text-foreground-600 leading-relaxed">
                  También aceptamos pagos en dólares. Muy pronto habilitaremos el pago en línea con
                  tarjeta desde el sitio.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-primary-500 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h3 className="font-heading text-lg font-semibold text-background-50">
                ¿Ya pagaste? Envíanos el comprobante
              </h3>
              <p className="mt-1 text-sm text-background-50/90">
                Compártenos la captura por WhatsApp y confirmamos tu cita al instante.
              </p>
            </div>
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent("Hola, acabo de realizar el pago de mi cita y quiero enviar el comprobante.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-background-50 px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-background-100 cursor-pointer whitespace-nowrap shrink-0"
            >
              <i className="ri-whatsapp-line" />
              Enviar comprobante
            </a>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/reservar"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-800 cursor-pointer"
            >
              <i className="ri-arrow-left-line" />
              Volver a reservar una cita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
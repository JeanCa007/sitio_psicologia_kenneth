import { useState } from "react";
import SectionHeading from "@/components/feature/SectionHeading";
import { siteInfo } from "@/mocks/siteContent";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contacto() {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formEl = event.currentTarget;
    const data = new FormData(formEl);

    const honeypot = String(data.get("website_alt") || "").trim();
    if (honeypot) {
      setStatus("success");
      setFormError("");
      return;
    }
    data.delete("website_alt");

    setStatus("submitting");
    setFormError("");

    const params = new URLSearchParams();
    data.forEach((value, key) => {
      params.append(key, String(value));
    });

    try {
      const response = await fetch("https://readdy.ai/api/form/db6l74jghk82orf0cmng", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const responseText = await response.text();
      let parsed: {
        code?: string;
        message?: string;
        meta?: { message?: string; detail?: string };
      } | null = null;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = null;
      }
      const serverMsg =
        parsed?.meta?.message || parsed?.message || parsed?.meta?.detail || responseText;
      const isSpam = typeof serverMsg === "string" && serverMsg.toLowerCase().includes("spam");

      if (response.ok && parsed?.code === "OK" && !isSpam) {
        setStatus("success");
        formEl.reset();
      } else {
        setStatus("error");
        setFormError(
          typeof serverMsg === "string" && serverMsg
            ? serverMsg
            : "No pudimos enviar tu mensaje. Intenta de nuevo.",
        );
      }
    } catch {
      setStatus("error");
      setFormError("Hubo un problema de conexión. Por favor intenta de nuevo.");
    }
  };

  const inputClass =
    "w-full rounded-md border border-background-300/70 bg-background-50 px-4 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            eyebrow="Contacto"
            title="Hablemos, estamos para escucharte"
            description="Escríbenos por WhatsApp o completa el formulario y te respondemos a la brevedad."
            align="left"
          />
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
          <aside className="lg:col-span-2 space-y-5">
            <a
              href={`https://wa.me/${siteInfo.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-background-200/80 bg-background-50 p-6 hover:border-primary-300 cursor-pointer transition-colors"
            >
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary-500 text-background-50 text-2xl dark:text-foreground-950">
                <i className="ri-whatsapp-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">WhatsApp</h3>
              <p className="mt-1 text-sm text-foreground-600">{siteInfo.whatsappDisplay}</p>
              <p className="mt-1 text-xs text-primary-700 font-semibold">Respuesta rápida</p>
            </a>

            <a
              href={`mailto:${siteInfo.email}`}
              className="block rounded-lg border border-background-200/80 bg-background-50 p-6 hover:border-primary-300 cursor-pointer transition-colors"
            >
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent-100 text-accent-700 text-2xl">
                <i className="ri-mail-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">Correo</h3>
              <p className="mt-1 text-sm text-foreground-600">{siteInfo.email}</p>
            </a>

            <div className="rounded-lg border border-background-200/80 bg-background-50 p-6">
              <span className="w-12 h-12 flex items-center justify-center rounded-lg bg-secondary-100 text-secondary-700 text-2xl">
                <i className="ri-time-line" />
              </span>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground-950">Horario</h3>
              <p className="mt-1 text-sm text-foreground-600">{siteInfo.scheduleText}</p>
              <p className="mt-1 text-sm text-foreground-600">{siteInfo.location}</p>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="rounded-lg border border-primary-300 bg-primary-100/60 p-8 text-center h-full flex flex-col items-center justify-center">
                <span className="w-16 h-16 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-3xl dark:text-foreground-950">
                  <i className="ri-check-line" />
                </span>
                <h3 className="mt-5 font-heading text-2xl font-semibold text-foreground-950">
                  ¡Mensaje enviado!
                </h3>
                <p className="mt-3 text-sm text-foreground-600 leading-relaxed max-w-md">
                  Gracias por escribirnos. Te responderemos lo antes posible. Si es urgente, también
                  puedes contactarnos por WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary-300 px-5 py-2.5 text-sm font-semibold text-primary-700 cursor-pointer whitespace-nowrap"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form
                id="form-contacto-serenamente"
                data-readdy-form="db6l74jghk82orf0cmng"
                onSubmit={handleSubmit}
                className="rounded-lg border border-background-200/80 bg-background-50 p-5 md:p-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Tu nombre"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="tucorreo@ejemplo.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="(+506) 8888 8888"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">
                      Motivo de contacto
                    </label>
                    <select name="motivo" defaultValue="Terapia" className={inputClass}>
                      <option value="Terapia">Terapia</option>
                      <option value="Atención en crisis">Atención en crisis</option>
                      <option value="Psicopedagogía">Psicopedagogía</option>
                      <option value="Diagnóstico">Diagnóstico</option>
                      <option value="Cursos y charlas">Cursos y charlas</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">
                      Mensaje
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      maxLength={500}
                      required
                      placeholder="Cuéntanos en qué te podemos ayudar."
                      className={`${inputClass} resize-none`}
                    />
                    <p className="mt-1 text-xs text-foreground-400">Máximo 500 caracteres.</p>
                  </div>
                </div>

                <div className="contact-ref-only">
                  <label htmlFor="website_alt">No completar este campo</label>
                  <input
                    id="website_alt"
                    type="text"
                    name="website_alt"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    readOnly
                  />
                </div>

                {status === "error" && formError && (
                  <p className="mt-5 rounded-md bg-accent-100 px-4 py-3 text-sm text-accent-900">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 dark:text-foreground-950"
                >
                  <i className={status === "submitting" ? "ri-loader-4-line animate-spin" : "ri-send-plane-line"} />
                  {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
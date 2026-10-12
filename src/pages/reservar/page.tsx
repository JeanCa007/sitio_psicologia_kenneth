import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import SectionHeading from "@/components/feature/SectionHeading";
import { useAvailability, useServices } from "@/hooks/useSiteData";
import { pickLocalized, useLang } from "@/hooks/useLang";
import { useSite } from "@/context/SiteContext";
import { supabase } from "@/lib/supabase";
import {
  formatTimeInZone,
  generateSlotTimes,
  guessTimeZone,
  weekdayInZone,
  zonedToUtc,
} from "@/lib/time";

interface Slot {
  value: string;
  label: string;
}

export default function Reservar() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { identity } = useSite();
  const { data: services } = useServices();
  const { data: availability } = useAvailability();
  const visitorTz = useMemo(() => guessTimeZone(), []);
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-CR";

  const [service, setService] = useState("");
  const [modality, setModality] = useState("WhatsApp");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [nombre, setNombre] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!service && services.length) setService(services[0].slug);
  }, [services, service]);

  const slots: Slot[] = useMemo(() => {
    if (!date) return [];
    const wd = weekdayInZone(date, identity.timezone);
    const blocks = availability.filter((a) => a.weekday === wd);
    const out: Slot[] = [];
    blocks.forEach((b) => {
      generateSlotTimes(b.start_time.slice(0, 5), b.end_time.slice(0, 5), b.slot_minutes).forEach((slot) => {
        const utc = zonedToUtc(date, slot, identity.timezone);
        out.push({ value: slot, label: formatTimeInZone(utc, visitorTz, locale) });
      });
    });
    return out;
  }, [date, availability, identity.timezone, visitorTz, locale]);

  useEffect(() => {
    setTime(slots.length ? slots[0].value : "");
  }, [slots]);

  const selectedService = services.find((s) => s.slug === service) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !phone.trim() || !date) {
      setError(t("booking.errorRequired"));
      return;
    }
    if (slots.length && !time) {
      setError(t("booking.errorTime"));
      return;
    }
    setError("");
    setSending(true);
    setMeetLink("");
    setEmailSent(false);

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("appointments")
        .insert({
          patient_name: nombre.trim(),
          patient_email: email.trim(),
          patient_phone: phone.trim(),
          service_slug: service,
          service_name: selectedService ? pickLocalized(selectedService, "name", lang) : "",
          preferred_date: date,
          preferred_time: time,
          modality,
          timezone: visitorTz,
          notes: notes.trim(),
        })
        .select("id")
        .single();

      if (!insertError && inserted && modality === "Google Meet") {
        const { data: fnData } = await supabase.functions.invoke("create-meeting", {
          body: {
            appointmentId: inserted.id,
            patientName: nombre.trim(),
            patientEmail: email.trim(),
            serviceName: selectedService ? pickLocalized(selectedService, "name", lang) : "",
            date,
            time,
            timezone: visitorTz,
            durationMin: selectedService?.duration_min ?? 50,
            brand: identity.brand,
            therapist: identity.therapist,
          },
        });
        const result = fnData as { meetLink?: string; emailSent?: boolean } | null;
        setMeetLink(result?.meetLink || "");
        setEmailSent(!!result?.emailSent);
      }
    } catch {
      /* keep going: we still let the person reach us */
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  const waMessage = [
    "Hola, quiero reservar una cita en " + identity.brand + ":",
    "• Servicio: " + (selectedService ? pickLocalized(selectedService, "name", lang) : ""),
    "• Modalidad: " + modality,
    "• Fecha: " + date,
    "• Hora: " + time + " (" + visitorTz + ")",
    "• Nombre: " + nombre,
    "• Email: " + (email || "no indicado"),
    "• Teléfono: " + phone,
    notes ? "• Notas: " + notes : "",
  ]
    .filter(Boolean)
    .join("\n");

  const inputClass =
    "w-full rounded-md border border-background-300/70 bg-background-50 px-4 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200";

  return (
    <div className="w-full">
      <section className="w-full bg-background-100 border-b border-background-200/70 px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading eyebrow={t("booking.eyebrow")} title={t("booking.title")} description={t("booking.desc")} align="left" />
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-background-50 px-3 py-1.5 text-xs text-foreground-600">
            <i className="ri-earth-line text-primary-600" />
            {t("booking.tzDetected")}: <strong>{visitorTz}</strong>
          </p>
        </div>
      </section>

      <section className="w-full px-4 md:px-8 py-10 md:py-14">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {sent ? (
              <div className="rounded-lg border border-primary-300 bg-primary-100/60 p-8 text-center">
                <span className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary-500 text-background-50 text-3xl dark:text-foreground-950">
                  <i className="ri-check-line" />
                </span>
                <h2 className="mt-5 font-heading text-2xl font-semibold text-foreground-950">{t("booking.successTitle")}</h2>
                <p className="mt-3 text-sm text-foreground-600 leading-relaxed">{t("booking.successText")}</p>
                {emailSent && email.trim() && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-background-50 px-3 py-1.5 text-xs text-primary-700">
                    <i className="ri-mail-check-line" />
                    {t("booking.emailSentNote")} {email.trim()}
                  </p>
                )}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  {modality === "Google Meet" && (
                    <a
                      href={meetLink || identity.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3 text-sm font-semibold text-background-50 cursor-pointer whitespace-nowrap dark:text-foreground-950"
                    >
                      <i className="ri-vidicon-line" />
                      {t("booking.openMeet")}
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${identity.whatsappNumber}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-300 px-6 py-3 text-sm font-semibold text-primary-700 cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-whatsapp-line" />
                    {t("booking.openWhatsapp")}
                  </a>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-background-300 px-6 py-3 text-sm font-semibold text-foreground-700 cursor-pointer whitespace-nowrap"
                  >
                    {t("booking.newBooking")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-lg border border-background-200/80 bg-background-50 p-5 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.service")}</label>
                    <select value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
                      {services.map((s) => (
                        <option key={s.id} value={s.slug}>
                          {pickLocalized(s, "name", lang)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <span className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.modalityLabel")}</span>
                    <div className="flex flex-wrap gap-2">
                      {["WhatsApp", "Google Meet"].map((mod) => (
                        <button
                          key={mod}
                          type="button"
                          onClick={() => setModality(mod)}
                          className={`rounded-full px-4 py-2 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                            modality === mod
                              ? "bg-primary-500 text-background-50 dark:text-foreground-950"
                              : "bg-background-100 text-foreground-700 hover:bg-primary-100"
                          }`}
                        >
                          {mod}
                        </button>
                      ))}
                    </div>
                    {modality === "Google Meet" && (
                      <p className="mt-2 text-xs text-foreground-500 inline-flex items-center gap-1.5">
                        <i className="ri-information-line text-primary-600" />
                        {t("booking.meetNote")}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.dateLabel")}</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.timeLabel")}</label>
                    <select value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} disabled={!slots.length}>
                      {slots.length ? (
                        slots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))
                      ) : (
                        <option value="">—</option>
                      )}
                    </select>
                    <p className="mt-1 text-xs text-foreground-500">{t("booking.tzNote")}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.name")}</label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t("booking.namePh")} className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.phone")}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("booking.phonePh")} className={inputClass} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.email")}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("booking.emailPh")} className={inputClass} />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-foreground-800 mb-2">{t("booking.notes")}</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                      rows={4}
                      maxLength={500}
                      placeholder={t("booking.notesPh")}
                      className={`${inputClass} resize-none`}
                    />
                    <p className="mt-1 text-xs text-foreground-400 text-right">
                      {notes.length}/500 {t("booking.chars")}
                    </p>
                  </div>
                </div>

                {error && <p className="mt-4 rounded-md bg-accent-100 px-4 py-3 text-sm text-accent-900">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 dark:text-foreground-950"
                >
                  <i className={sending ? "ri-loader-4-line animate-spin" : "ri-calendar-check-line"} />
                  {sending ? t("booking.submitting") : t("booking.submit")}
                </button>
                <p className="mt-3 text-center text-xs text-foreground-500">{t("booking.submitHint")}</p>
              </form>
            )}
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-lg border border-background-200/80 bg-background-100/60 p-6">
              <h3 className="font-heading text-lg font-semibold text-foreground-950">{t("booking.asideTitle")}</h3>
              <ul className="mt-4 space-y-4">
                {(t("booking.asideSteps", { returnObjects: true }) as unknown as string[]).map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-background-50 text-primary-700 shrink-0">
                      <i className="ri-check-line" />
                    </span>
                    <span className="text-sm text-foreground-700 leading-relaxed pt-2">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-lg bg-accent-500 p-6 text-background-50">
              <h3 className="font-heading text-base font-semibold">{t("booking.crisisTitle")}</h3>
              <p className="mt-2 text-sm text-background-50/90 leading-relaxed">{t("booking.crisisText")}</p>
              <a
                href={`https://wa.me/${identity.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-background-50 px-4 py-2.5 text-sm font-semibold text-accent-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-flashlight-line" />
                {t("booking.crisisBtn")}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
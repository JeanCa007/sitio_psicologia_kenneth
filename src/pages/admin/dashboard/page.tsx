import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AdminPageHeader, Card, EmptyState } from "@/components/admin/ui";
import { supabase } from "@/lib/supabase";
import { labelOf, appointmentStatusLabels } from "@/lib/labels";
import { useLang } from "@/hooks/useLang";
import { formatDateLong } from "@/lib/format";
import type { AppointmentRow } from "@/lib/types";

interface Stats {
  appointments: number;
  pending: number;
  messages: number;
  services: number;
  courses: number;
}

export default function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-CR";

  const [stats, setStats] = useState<Stats>({
    appointments: 0,
    pending: 0,
    messages: 0,
    services: 0,
    courses: 0,
  });
  const [recent, setRecent] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const [apptAll, apptPending, msgs, svcs, crs, recentRes] = await Promise.all([
          supabase.from("appointments").select("id", { count: "exact", head: true }),
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pendiente"),
          supabase.from("contact_messages").select("id", { count: "exact", head: true }),
          supabase.from("services").select("id", { count: "exact", head: true }).eq("is_active", true),
          supabase.from("courses").select("id", { count: "exact", head: true }),
          supabase.from("appointments").select("*").order("created_at", { ascending: false }).limit(5),
        ]);
        if (!active) return;
        setStats({
          appointments: apptAll.count ?? 0,
          pending: apptPending.count ?? 0,
          messages: msgs.count ?? 0,
          services: svcs.count ?? 0,
          courses: crs.count ?? 0,
        });
        setRecent((recentRes.data as AppointmentRow[]) ?? []);
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tick]);

  const cards = [
    { label: t("admin.dashboard.statAppointments"), value: stats.appointments, icon: "ri-calendar-check-line", tone: "primary" },
    { label: t("admin.dashboard.statPending"), value: stats.pending, icon: "ri-time-line", tone: "accent" },
    { label: t("admin.dashboard.statMessages"), value: stats.messages, icon: "ri-mail-line", tone: "secondary" },
    { label: t("admin.dashboard.statServices"), value: stats.services, icon: "ri-briefcase-line", tone: "primary" },
    { label: t("admin.dashboard.statCourses"), value: stats.courses, icon: "ri-book-open-line", tone: "accent" },
  ];

  const toneClass: Record<string, string> = {
    primary: "bg-primary-100 text-primary-700",
    accent: "bg-accent-100 text-accent-700",
    secondary: "bg-secondary-100 text-secondary-700",
  };

  return (
    <div>
      <AdminPageHeader title={t("admin.dashboard.title")} subtitle={t("admin.dashboard.subtitle")} />

      {error && (
        <Card className="p-6 mb-6">
          <p className="text-sm text-accent-900">{t("admin.common.errorGeneric")}</p>
          <button
            type="button"
            onClick={() => setTick((v) => v + 1)}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line" />
            {t("common.retry")}
          </button>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="p-4 md:p-5">
            <span className={`w-10 h-10 flex items-center justify-center rounded-lg text-xl ${toneClass[card.tone]}`}>
              <i className={card.icon} />
            </span>
            <p className="mt-3 font-heading text-2xl md:text-3xl font-semibold text-foreground-950">
              {loading ? "—" : card.value}
            </p>
            <p className="mt-1 text-xs text-foreground-600 leading-snug">{card.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-heading text-lg font-semibold text-foreground-950">
              {t("admin.dashboard.recentTitle")}
            </h2>
            <Link
              to="/admin/citas"
              className="text-sm font-semibold text-primary-700 hover:underline cursor-pointer whitespace-nowrap"
            >
              {t("admin.dashboard.viewAll")}
            </Link>
          </div>

          {recent.length === 0 ? (
            <EmptyState text={t("admin.appointments.empty")} icon="ri-calendar-line" />
          ) : (
            <ul className="divide-y divide-background-200/70">
              {recent.map((appt) => (
                <li key={appt.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground-950 truncate">{appt.patient_name}</p>
                    <p className="text-xs text-foreground-500 truncate">
                      {appt.service_name} · {formatDateLong(appt.preferred_date, locale)} {appt.preferred_time}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      appt.status === "pendiente"
                        ? "bg-accent-100 text-accent-900"
                        : appt.status === "confirmada"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-secondary-100 text-secondary-900"
                    }`}
                  >
                    {labelOf(appointmentStatusLabels, appt.status, lang)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 md:p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
            {t("admin.dashboard.quickTitle")}
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/citas"
              className="flex items-center gap-3 rounded-md border border-background-200/80 px-4 py-3 text-sm font-medium text-foreground-800 hover:border-primary-300 hover:bg-primary-100/40 cursor-pointer"
            >
              <i className="ri-calendar-check-line text-lg text-primary-700" />
              {t("admin.dashboard.quickAppointments")}
            </Link>
            <Link
              to="/admin/servicios"
              className="flex items-center gap-3 rounded-md border border-background-200/80 px-4 py-3 text-sm font-medium text-foreground-800 hover:border-primary-300 hover:bg-primary-100/40 cursor-pointer"
            >
              <i className="ri-briefcase-line text-lg text-accent-700" />
              {t("admin.dashboard.quickServices")}
            </Link>
            <Link
              to="/admin/contenido"
              className="flex items-center gap-3 rounded-md border border-background-200/80 px-4 py-3 text-sm font-medium text-foreground-800 hover:border-primary-300 hover:bg-primary-100/40 cursor-pointer"
            >
              <i className="ri-edit-box-line text-lg text-secondary-700" />
              {t("admin.dashboard.quickContent")}
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
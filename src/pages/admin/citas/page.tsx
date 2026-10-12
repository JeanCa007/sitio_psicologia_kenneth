import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AdminPageHeader,
  Card,
  ConfirmDialog,
  EmptyState,
  Modal,
  Toast,
} from "@/components/admin/ui";
import { supabase } from "@/lib/supabase";
import {
  appointmentStatusLabels,
  labelOf,
  paymentStatusLabels,
} from "@/lib/labels";
import { useLang } from "@/hooks/useLang";
import { formatDateLong } from "@/lib/format";
import { useSite } from "@/context/SiteContext";
import type { AppointmentRow } from "@/lib/types";

const STATUSES = ["pendiente", "confirmada", "completada", "cancelada"];
const PAYMENTS = ["pendiente", "pagado"];

export default function AdminCitas() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const { identity } = useSite();
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-CR";

  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [toast, setToast] = useState("");
  const [detail, setDetail] = useState<AppointmentRow | null>(null);
  const [toDelete, setToDelete] = useState<AppointmentRow | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("appointments")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setRows((data as AppointmentRow[]) ?? []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const filtered = useMemo(
    () => (filter === "todos" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const updateField = async (row: AppointmentRow, field: "status" | "payment_status", value: string) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [field]: value } : r)));
    const { error: err } = await supabase.from("appointments").update({ [field]: value }).eq("id", row.id);
    if (err) {
      setError(true);
      load();
    } else {
      setToast(t("admin.common.savedToast"));
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error: err } = await supabase.from("appointments").delete().eq("id", toDelete.id);
    if (err) {
      setError(true);
    } else {
      setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
      setToast(t("admin.common.savedToast"));
    }
    setToDelete(null);
  };

  const handleCreateMeeting = async (row: AppointmentRow) => {
    setToast(t("admin.appointments.meetingGenerating"));
    try {
      const { data: fnData } = await supabase.functions.invoke("create-meeting", {
        body: {
          appointmentId: row.id,
          patientName: row.patient_name,
          patientEmail: row.patient_email,
          serviceName: row.service_name,
          date: row.preferred_date,
          time: row.preferred_time,
          timezone: row.timezone,
          brand: identity.brand,
          therapist: identity.therapist,
        },
      });
      const link = (fnData as { meetLink?: string } | null)?.meetLink || "";
      if (link) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, meet_link: link } : r)));
        setDetail((prev) => (prev && prev.id === row.id ? { ...prev, meet_link: link } : prev));
        setToast(t("admin.common.savedToast"));
      } else {
        setToast(t("admin.appointments.meetFailed"));
      }
    } catch {
      setToast(t("admin.appointments.meetFailed"));
    }
  };

  const copyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setToast(t("admin.appointments.meetCopied"));
    } catch {
      setToast(t("admin.appointments.meetFailed"));
    }
  };

  return (
    <div>
      <AdminPageHeader title={t("admin.appointments.title")} subtitle={t("admin.appointments.subtitle")} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("todos")}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
            filter === "todos" ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "bg-background-50 border border-background-200/80 text-foreground-700 hover:bg-background-100"
          }`}
        >
          {t("admin.common.all")}
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
              filter === s ? "bg-primary-500 text-background-50 dark:text-foreground-950" : "bg-background-50 border border-background-200/80 text-foreground-700 hover:bg-background-100"
            }`}
          >
            {labelOf(appointmentStatusLabels, s, lang)}
          </button>
        ))}
      </div>

      {error && (
        <Card className="p-5 mb-4">
          <p className="text-sm text-accent-900">{t("admin.common.errorGeneric")}</p>
          <button
            type="button"
            onClick={load}
            className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-100 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-refresh-line" />
            {t("common.retry")}
          </button>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <i className="ri-loader-4-line animate-spin text-2xl text-primary-600" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState text={t("admin.appointments.empty")} icon="ri-calendar-line" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead>
                <tr className="border-b border-background-200/80 bg-background-100/60 text-left text-xs uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-3 font-semibold">{t("admin.appointments.patient")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.appointments.service")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.appointments.dateTime")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.common.status")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.appointments.payment")}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-200/70">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-background-100/50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-foreground-950">{row.patient_name}</p>
                      <p className="text-xs text-foreground-500">{row.patient_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground-700">
                      <p>{row.service_name || "—"}</p>
                      <p className="text-xs text-foreground-500">{row.modality}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground-700">
                      <p>{formatDateLong(row.preferred_date, locale)}</p>
                      <p className="text-xs text-foreground-500">
                        {row.preferred_time} · {row.timezone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateField(row, "status", e.target.value)}
                        className="rounded-md border border-background-300/70 bg-background-50 px-2.5 py-1.5 text-xs text-foreground-900 focus:border-primary-400 focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {labelOf(appointmentStatusLabels, s, lang)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.payment_status}
                        onChange={(e) => updateField(row, "payment_status", e.target.value)}
                        className="rounded-md border border-background-300/70 bg-background-50 px-2.5 py-1.5 text-xs text-foreground-900 focus:border-primary-400 focus:outline-none"
                      >
                        {PAYMENTS.map((p) => (
                          <option key={p} value={p}>
                            {labelOf(paymentStatusLabels, p, lang)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetail(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-primary-700 hover:bg-primary-100 cursor-pointer"
                          aria-label={t("common.viewDetail")}
                        >
                          <i className="ri-eye-line" />
                        </button>
                        {row.meet_link && (
                          <a
                            href={row.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 flex items-center justify-center rounded-md text-primary-700 hover:bg-primary-100 cursor-pointer"
                            aria-label="Google Meet"
                          >
                            <i className="ri-vidicon-line" />
                          </a>
                        )}
                        <a
                          href={`https://wa.me/${row.patient_phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 flex items-center justify-center rounded-md text-primary-700 hover:bg-primary-100 cursor-pointer"
                          aria-label="WhatsApp"
                        >
                          <i className="ri-whatsapp-line" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setToDelete(row)}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-accent-700 hover:bg-accent-100 cursor-pointer"
                          aria-label={t("admin.common.delete")}
                        >
                          <i className="ri-delete-bin-line" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={!!detail} title={t("admin.appointments.detailTitle")} onClose={() => setDetail(null)}>
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-foreground-500">{t("admin.appointments.patient")}</p>
                <p className="font-semibold text-foreground-950">{detail.patient_name}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("admin.appointments.contact")}</p>
                <p className="text-foreground-800">{detail.patient_phone}</p>
                <p className="text-foreground-800">{detail.patient_email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("admin.appointments.service")}</p>
                <p className="text-foreground-800">{detail.service_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("admin.appointments.dateTime")}</p>
                <p className="text-foreground-800">
                  {formatDateLong(detail.preferred_date, locale)} · {detail.preferred_time}
                </p>
                <p className="text-xs text-foreground-500">{detail.timezone}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("admin.appointments.modality")}</p>
                <p className="text-foreground-800">{detail.modality}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-foreground-500">{t("admin.appointments.notes")}</p>
              <p className="mt-1 rounded-md bg-background-100 p-3 text-foreground-800 leading-relaxed">
                {detail.notes || "—"}
              </p>
            </div>
            <div className="border-t border-background-200/70 pt-4">
              <p className="text-xs text-foreground-500">{t("admin.appointments.meet")}</p>
              {detail.meet_link ? (
                <div className="mt-1.5 space-y-2">
                  <p className="rounded-md bg-background-100 p-2.5 text-xs text-foreground-700 break-all">{detail.meet_link}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={detail.meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 cursor-pointer whitespace-nowrap dark:text-foreground-950"
                    >
                      <i className="ri-vidicon-line" /> {t("admin.appointments.meetOpen")}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyLink(detail.meet_link)}
                      className="inline-flex items-center gap-2 rounded-md border border-background-300 px-3 py-2 text-xs font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-file-copy-line" /> {t("admin.appointments.meetCopy")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCreateMeeting(detail)}
                      className="inline-flex items-center gap-2 rounded-md border border-primary-300 px-3 py-2 text-xs font-semibold text-primary-700 hover:bg-primary-100 cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-refresh-line" /> {t("admin.appointments.meetRegenerate")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1.5">
                  <button
                    type="button"
                    onClick={() => handleCreateMeeting(detail)}
                    className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-3 py-2 text-xs font-semibold text-background-50 cursor-pointer whitespace-nowrap dark:text-foreground-950"
                  >
                    <i className="ri-vidicon-line" /> {t("admin.appointments.meetGenerate")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title={t("admin.common.confirmDeleteTitle")}
        text={t("admin.common.confirmDeleteText")}
        confirmLabel={t("admin.common.confirm")}
        cancelLabel={t("admin.common.cancel")}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
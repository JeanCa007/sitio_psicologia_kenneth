import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AdminPageHeader,
  Card,
  ConfirmDialog,
  EmptyState,
  Field,
  Modal,
  Select,
  TextInput,
  Toast,
  Toggle,
} from "@/components/admin/ui";
import { supabase } from "@/lib/supabase";
import { weekdayLabels } from "@/lib/labels";
import { useLang } from "@/hooks/useLang";
import type { AvailabilityRow } from "@/lib/types";

type Draft = Omit<AvailabilityRow, "id"> & { id?: string };

const emptyDraft: Draft = {
  weekday: 1,
  start_time: "07:00",
  end_time: "20:00",
  slot_minutes: 60,
  is_active: true,
};

export default function AdminHorarios() {
  const { t } = useTranslation();
  const lang = useLang();
  const [rows, setRows] = useState<AvailabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<AvailabilityRow | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("availability")
        .select("*")
        .order("weekday", { ascending: true });
      if (err) throw err;
      setRows((data as AvailabilityRow[]) ?? []);
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

  const set = (patch: Partial<Draft>) => setDraft((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    const payload = {
      weekday: Number(draft.weekday),
      start_time: draft.start_time,
      end_time: draft.end_time,
      slot_minutes: Number(draft.slot_minutes) || 60,
      is_active: draft.is_active,
    };
    const { error: err } = draft.id
      ? await supabase.from("availability").update(payload).eq("id", draft.id)
      : await supabase.from("availability").insert(payload);
    setSaving(false);
    if (err) {
      setToast(t("admin.common.errorGeneric"));
      return;
    }
    setDraft(null);
    setToast(t("admin.common.savedToast"));
    load();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error: err } = await supabase.from("availability").delete().eq("id", toDelete.id);
    if (err) {
      setToast(t("admin.common.errorGeneric"));
    } else {
      setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
      setToast(t("admin.common.savedToast"));
    }
    setToDelete(null);
  };

  return (
    <div>
      <AdminPageHeader
        title={t("admin.availability.title")}
        subtitle={t("admin.availability.subtitle")}
        action={
          <button
            type="button"
            onClick={() => setDraft({ ...emptyDraft })}
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap dark:text-foreground-950"
          >
            <i className="ri-add-line" />
            {t("admin.availability.new")}
          </button>
        }
      />

      <div className="mb-4 flex items-start gap-2 rounded-md bg-secondary-100/70 px-4 py-3 text-sm text-secondary-900">
        <i className="ri-information-line mt-0.5" />
        <span>{t("admin.availability.note")}</span>
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
        ) : rows.length === 0 ? (
          <EmptyState text={t("admin.availability.empty")} icon="ri-time-line" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-background-200/80 bg-background-100/60 text-left text-xs uppercase tracking-wide text-foreground-500">
                  <th className="px-4 py-3 font-semibold">{t("admin.availability.weekday")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.availability.start")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.availability.end")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.availability.slot")}</th>
                  <th className="px-4 py-3 font-semibold">{t("admin.common.status")}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t("admin.common.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background-200/70">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-background-100/50">
                    <td className="px-4 py-3 font-semibold text-foreground-950">
                      {weekdayLabels[row.weekday]?.[lang] ?? ""}
                    </td>
                    <td className="px-4 py-3 text-foreground-700">{row.start_time.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-foreground-700">{row.end_time.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-foreground-700">{row.slot_minutes} min</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.is_active ? "bg-primary-100 text-primary-700" : "bg-background-200 text-foreground-600"
                        }`}
                      >
                        {row.is_active ? t("admin.common.active") : t("admin.common.inactive")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDraft({ ...row })}
                          className="w-8 h-8 flex items-center justify-center rounded-md text-primary-700 hover:bg-primary-100 cursor-pointer"
                          aria-label={t("admin.common.edit")}
                        >
                          <i className="ri-pencil-line" />
                        </button>
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

      <Modal
        open={!!draft}
        title={draft?.id ? t("admin.availability.edit") : t("admin.availability.new")}
        onClose={() => setDraft(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="rounded-md border border-background-300 px-5 py-2.5 text-sm font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
            >
              {t("admin.common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap disabled:opacity-60 dark:text-foreground-950"
            >
              <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-line"} />
              {saving ? t("admin.common.saving") : t("admin.common.save")}
            </button>
          </>
        }
      >
        {draft && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("admin.availability.weekday")} className="sm:col-span-2">
              <Select value={draft.weekday} onChange={(e) => set({ weekday: Number(e.target.value) })}>
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <option key={d} value={d}>
                    {weekdayLabels[d]?.[lang] ?? ""}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("admin.availability.start")}>
              <TextInput type="time" value={draft.start_time.slice(0, 5)} onChange={(e) => set({ start_time: e.target.value })} />
            </Field>
            <Field label={t("admin.availability.end")}>
              <TextInput type="time" value={draft.end_time.slice(0, 5)} onChange={(e) => set({ end_time: e.target.value })} />
            </Field>
            <Field label={t("admin.availability.slot")} className="sm:col-span-2">
              <TextInput type="number" value={draft.slot_minutes} onChange={(e) => set({ slot_minutes: Number(e.target.value) })} />
            </Field>
            <div className="sm:col-span-2">
              <Toggle checked={draft.is_active} onChange={(v) => set({ is_active: v })} label={t("admin.common.active")} />
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
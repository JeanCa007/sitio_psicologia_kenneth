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
  TextArea,
  TextInput,
  Toast,
  Toggle,
} from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { courseTypeLabels, labelOf } from "@/lib/labels";
import { useLang } from "@/hooks/useLang";
import { formatCrc, formatDateLong, formatUsd } from "@/lib/format";
import type { CourseRow } from "@/lib/types";

const TYPES = ["charla", "curso", "capacitacion"];
const MODALITIES = ["Google Meet", "WhatsApp"];

type Draft = Omit<CourseRow, "id" | "created_at"> & { id?: string };

const emptyDraft: Draft = {
  title_es: "",
  title_en: "",
  type: "charla",
  description_es: "",
  description_en: "",
  modality: "Google Meet",
  start_date: "",
  start_time: "10:00",
  duration_min: 90,
  price_crc: 15000,
  price_usd: 24,
  cover_url: "",
  is_active: true,
};

export default function AdminCursos() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const locale = i18n.language.startsWith("en") ? "en-US" : "es-CR";

  const [rows, setRows] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<CourseRow | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("courses")
        .select("*")
        .order("start_date", { ascending: true });
      if (err) throw err;
      setRows((data as CourseRow[]) ?? []);
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
    if (!draft.title_es.trim()) {
      setToast(t("admin.common.required"));
      return;
    }
    setSaving(true);
    const payload = {
      title_es: draft.title_es.trim(),
      title_en: draft.title_en.trim(),
      type: draft.type,
      description_es: draft.description_es,
      description_en: draft.description_en,
      modality: draft.modality,
      start_date: draft.start_date || null,
      start_time: draft.start_time,
      duration_min: Number(draft.duration_min) || 0,
      price_crc: Number(draft.price_crc) || 0,
      price_usd: Number(draft.price_usd) || 0,
      cover_url: draft.cover_url,
      is_active: draft.is_active,
    };
    const { error: err } = draft.id
      ? await supabase.from("courses").update(payload).eq("id", draft.id)
      : await supabase.from("courses").insert(payload);
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
    const { error: err } = await supabase.from("courses").delete().eq("id", toDelete.id);
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
        title={t("admin.courses.title")}
        subtitle={t("admin.courses.subtitle")}
        action={
          <button
            type="button"
            onClick={() => setDraft({ ...emptyDraft })}
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap dark:text-foreground-950"
          >
            <i className="ri-add-line" />
            {t("admin.courses.new")}
          </button>
        }
      />

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

      {loading ? (
        <Card className="flex items-center justify-center py-16">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-600" />
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState text={t("admin.courses.empty")} icon="ri-book-open-line" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((row) => (
            <Card key={row.id} className="p-4 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-900">
                  {labelOf(courseTypeLabels, row.type, lang)}
                </span>
                {!row.is_active && (
                  <span className="rounded-full bg-background-200 px-2.5 py-0.5 text-xs font-medium text-foreground-600 whitespace-nowrap">
                    {t("admin.common.inactive")}
                  </span>
                )}
              </div>
              <p className="mt-3 font-heading text-base font-semibold text-foreground-950 leading-snug">
                {row[`title_${lang}`] || row.title_es}
              </p>
              <p className="mt-1 text-sm text-foreground-600 line-clamp-2">
                {row[`description_${lang}`] || row.description_es}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-foreground-700">
                  <i className="ri-calendar-line mr-1 text-primary-600" />
                  {formatDateLong(row.start_date, locale)} {row.start_time}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold text-foreground-950">{formatCrc(Number(row.price_crc))}</span>
                <span className="text-foreground-500">{formatUsd(Number(row.price_usd))}</span>
                <span className="text-foreground-500">{row.modality}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-background-200/70 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setDraft({ ...row })}
                  className="inline-flex items-center gap-1.5 rounded-md border border-background-300 px-3 py-1.5 text-xs font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
                >
                  <i className="ri-pencil-line" />
                  {t("admin.common.edit")}
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
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!draft}
        title={draft?.id ? t("admin.courses.edit") : t("admin.courses.new")}
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
            <Field label={t("admin.courses.titleEs")}>
              <TextInput value={draft.title_es} onChange={(e) => set({ title_es: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.titleEn")}>
              <TextInput value={draft.title_en} onChange={(e) => set({ title_en: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.type")}>
              <Select value={draft.type} onChange={(e) => set({ type: e.target.value })}>
                {TYPES.map((c) => (
                  <option key={c} value={c}>
                    {labelOf(courseTypeLabels, c, lang)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("admin.courses.modality")}>
              <Select value={draft.modality} onChange={(e) => set({ modality: e.target.value })}>
                {MODALITIES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("admin.courses.descEs")} className="sm:col-span-2">
              <TextArea rows={3} value={draft.description_es} onChange={(e) => set({ description_es: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.descEn")} className="sm:col-span-2">
              <TextArea rows={3} value={draft.description_en} onChange={(e) => set({ description_en: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.date")}>
              <TextInput type="date" value={draft.start_date ?? ""} onChange={(e) => set({ start_date: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.time")}>
              <TextInput type="time" value={draft.start_time} onChange={(e) => set({ start_time: e.target.value })} />
            </Field>
            <Field label={t("admin.courses.duration")}>
              <TextInput type="number" value={draft.duration_min} onChange={(e) => set({ duration_min: Number(e.target.value) })} />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                value={draft.cover_url}
                onChange={(url) => set({ cover_url: url })}
                label={t("admin.courses.cover")}
                folder="courses"
                previewClass="w-40 h-24"
              />
            </div>
            <Field label={t("admin.courses.priceCrc")}>
              <TextInput type="number" value={draft.price_crc} onChange={(e) => set({ price_crc: Number(e.target.value) })} />
            </Field>
            <Field label={t("admin.courses.priceUsd")}>
              <TextInput type="number" value={draft.price_usd} onChange={(e) => set({ price_usd: Number(e.target.value) })} />
            </Field>
            <div className="sm:col-span-2">
              <Toggle checked={draft.is_active} onChange={(v) => set({ is_active: v })} label={t("admin.common.visible")} />
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
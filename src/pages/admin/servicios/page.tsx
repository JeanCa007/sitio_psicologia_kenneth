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
import { labelOf, serviceCategoryLabels } from "@/lib/labels";
import { useLang } from "@/hooks/useLang";
import { formatCrc, formatDuration, formatUsd } from "@/lib/format";
import type { ServiceRow } from "@/lib/types";

const CATEGORIES = ["terapia", "crisis", "psicopedagogia", "diagnostico"];

type Draft = Omit<ServiceRow, "id" | "created_at"> & { id?: string };

const emptyDraft: Draft = {
  slug: "",
  name_es: "",
  name_en: "",
  category: "terapia",
  short_es: "",
  short_en: "",
  description_es: "",
  description_en: "",
  duration_min: 50,
  price_crc: 28000,
  price_usd: 45,
  icon: "ri-user-heart-line",
  image_url: "",
  includes_es: [],
  includes_en: [],
  is_active: true,
  sort_order: 1,
};

export default function AdminServicios() {
  const { t } = useTranslation();
  const lang = useLang();
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<ServiceRow | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (err) throw err;
      setRows((data as ServiceRow[]) ?? []);
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
    if (!draft.name_es.trim() || !draft.slug.trim()) {
      setToast(t("admin.common.required"));
      return;
    }
    setSaving(true);
    const payload = {
      slug: draft.slug.trim(),
      name_es: draft.name_es.trim(),
      name_en: draft.name_en.trim(),
      category: draft.category,
      short_es: draft.short_es,
      short_en: draft.short_en,
      description_es: draft.description_es,
      description_en: draft.description_en,
      duration_min: Number(draft.duration_min) || 0,
      price_crc: Number(draft.price_crc) || 0,
      price_usd: Number(draft.price_usd) || 0,
      icon: draft.icon,
      image_url: draft.image_url,
      includes_es: draft.includes_es,
      includes_en: draft.includes_en,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order) || 0,
    };
    const { error: err } = draft.id
      ? await supabase.from("services").update(payload).eq("id", draft.id)
      : await supabase.from("services").insert(payload);
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
    const { error: err } = await supabase.from("services").delete().eq("id", toDelete.id);
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
        title={t("admin.services.title")}
        subtitle={t("admin.services.subtitle")}
        action={
          <button
            type="button"
            onClick={() => setDraft({ ...emptyDraft, sort_order: rows.length + 1 })}
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap dark:text-foreground-950"
          >
            <i className="ri-add-line" />
            {t("admin.services.new")}
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
          <EmptyState text={t("admin.services.empty")} icon="ri-briefcase-line" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((row) => (
            <Card key={row.id} className="p-4 flex flex-col">
              <div className="flex items-start gap-3">
                <span className="w-11 h-11 flex items-center justify-center rounded-lg bg-primary-100 text-primary-700 text-xl shrink-0">
                  <i className={row.icon || "ri-service-line"} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-base font-semibold text-foreground-950 leading-snug">
                    {row[`name_${lang}`] || row.name_es}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-900">
                    {labelOf(serviceCategoryLabels, row.category, lang)}
                  </span>
                </div>
                {!row.is_active && (
                  <span className="rounded-full bg-background-200 px-2.5 py-0.5 text-xs font-medium text-foreground-600 whitespace-nowrap">
                    {t("admin.common.inactive")}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-foreground-600 line-clamp-2">
                {row[`short_${lang}`] || row.short_es}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="font-semibold text-foreground-950">{formatCrc(Number(row.price_crc))}</span>
                <span className="text-foreground-500">{formatUsd(Number(row.price_usd))}</span>
                <span className="text-foreground-500">
                  <i className="ri-time-line mr-1" />
                  {formatDuration(row.duration_min)}
                </span>
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
        title={draft?.id ? t("admin.services.edit") : t("admin.services.new")}
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
            <Field label={t("admin.services.nameEs")}>
              <TextInput value={draft.name_es} onChange={(e) => set({ name_es: e.target.value })} />
            </Field>
            <Field label={t("admin.services.nameEn")}>
              <TextInput value={draft.name_en} onChange={(e) => set({ name_en: e.target.value })} />
            </Field>
            <Field label={t("admin.services.slug")}>
              <TextInput value={draft.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="terapia-individual" />
            </Field>
            <Field label={t("admin.services.category")}>
              <Select value={draft.category} onChange={(e) => set({ category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {labelOf(serviceCategoryLabels, c, lang)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label={t("admin.services.shortEs")}>
              <TextArea rows={2} value={draft.short_es} onChange={(e) => set({ short_es: e.target.value })} />
            </Field>
            <Field label={t("admin.services.shortEn")}>
              <TextArea rows={2} value={draft.short_en} onChange={(e) => set({ short_en: e.target.value })} />
            </Field>
            <Field label={t("admin.services.descEs")} className="sm:col-span-2">
              <TextArea rows={3} value={draft.description_es} onChange={(e) => set({ description_es: e.target.value })} />
            </Field>
            <Field label={t("admin.services.descEn")} className="sm:col-span-2">
              <TextArea rows={3} value={draft.description_en} onChange={(e) => set({ description_en: e.target.value })} />
            </Field>
            <Field label={t("admin.services.duration")}>
              <TextInput type="number" value={draft.duration_min} onChange={(e) => set({ duration_min: Number(e.target.value) })} />
            </Field>
            <Field label={t("admin.services.sort")}>
              <TextInput type="number" value={draft.sort_order} onChange={(e) => set({ sort_order: Number(e.target.value) })} />
            </Field>
            <Field label={t("admin.services.priceCrc")}>
              <TextInput type="number" value={draft.price_crc} onChange={(e) => set({ price_crc: Number(e.target.value) })} />
            </Field>
            <Field label={t("admin.services.priceUsd")}>
              <TextInput type="number" value={draft.price_usd} onChange={(e) => set({ price_usd: Number(e.target.value) })} />
            </Field>
            <Field label={t("admin.services.icon")}>
              <TextInput value={draft.icon} onChange={(e) => set({ icon: e.target.value })} placeholder="ri-user-heart-line" />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload
                value={draft.image_url}
                onChange={(url) => set({ image_url: url })}
                label={t("admin.services.image")}
                folder="services"
                previewClass="w-24 h-24"
              />
            </div>
            <Field label={t("admin.services.includesEs")} hint={t("admin.common.onePerLine")}>
              <TextArea
                rows={3}
                value={draft.includes_es.join("\n")}
                onChange={(e) => set({ includes_es: e.target.value.split("\n") })}
              />
            </Field>
            <Field label={t("admin.services.includesEn")} hint={t("admin.common.onePerLine")}>
              <TextArea
                rows={3}
                value={draft.includes_en.join("\n")}
                onChange={(e) => set({ includes_en: e.target.value.split("\n") })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Toggle
                checked={draft.is_active}
                onChange={(v) => set({ is_active: v })}
                label={t("admin.common.visible")}
              />
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
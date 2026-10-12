import { useEffect, useState } from "react";
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
import type { ContactMessageRow } from "@/lib/types";

export default function AdminMensajes() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [detail, setDetail] = useState<ContactMessageRow | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessageRow | null>(null);
  const [toast, setToast] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setRows((data as ContactMessageRow[]) ?? []);
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

  const handleDelete = async () => {
    if (!toDelete) return;
    const { error: err } = await supabase.from("contact_messages").delete().eq("id", toDelete.id);
    if (err) {
      setError(true);
    } else {
      setRows((prev) => prev.filter((r) => r.id !== toDelete.id));
      setToast(t("admin.common.savedToast"));
    }
    setToDelete(null);
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("es-CR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div>
      <AdminPageHeader title={t("admin.messages.title")} subtitle={t("admin.messages.subtitle")} />

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
          <EmptyState text={t("admin.messages.empty")} icon="ri-mail-line" />
        ) : (
          <ul className="divide-y divide-background-200/70">
            {rows.map((row) => (
              <li key={row.id} className="flex items-start justify-between gap-4 px-4 md:px-5 py-4 hover:bg-background-100/50">
                <button type="button" onClick={() => setDetail(row)} className="min-w-0 text-left cursor-pointer">
                  <p className="text-sm font-semibold text-foreground-950">{row.name}</p>
                  <p className="text-xs text-foreground-500">
                    {row.email} · {formatDate(row.created_at)}
                  </p>
                  <p className="mt-1 text-sm text-foreground-700 line-clamp-2">{row.message}</p>
                  {row.motivo && (
                    <span className="mt-1.5 inline-block rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-900">
                      {row.motivo}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setToDelete(row)}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-accent-700 hover:bg-accent-100 cursor-pointer shrink-0"
                  aria-label={t("admin.common.delete")}
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={!!detail} title={t("admin.messages.detailTitle")} onClose={() => setDetail(null)}>
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-foreground-500">{t("contact.name")}</p>
                <p className="font-semibold text-foreground-950">{detail.name}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("contact.email")}</p>
                <a href={`mailto:${detail.email}`} className="text-primary-700 hover:underline">
                  {detail.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("contact.phone")}</p>
                <p className="text-foreground-800">{detail.phone || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-500">{t("admin.messages.motivo")}</p>
                <p className="text-foreground-800">{detail.motivo || "—"}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-foreground-500">{t("contact.message")}</p>
              <p className="mt-1 rounded-md bg-background-100 p-3 text-foreground-800 leading-relaxed whitespace-pre-wrap">
                {detail.message}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${(detail.phone || "").replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 cursor-pointer whitespace-nowrap dark:text-foreground-950"
              >
                <i className="ri-whatsapp-line" />
                WhatsApp
              </a>
              <a
                href={`mailto:${detail.email}`}
                className="inline-flex items-center gap-2 rounded-md border border-primary-300 px-4 py-2.5 text-sm font-semibold text-primary-700 cursor-pointer whitespace-nowrap"
              >
                <i className="ri-mail-send-line" />
                {t("contact.email")}
              </a>
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
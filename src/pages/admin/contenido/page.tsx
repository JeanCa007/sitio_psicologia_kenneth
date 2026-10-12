import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AdminPageHeader,
  Card,
  Field,
  TextArea,
  TextInput,
  Toast,
} from "@/components/admin/ui";
import ImageUpload from "@/components/admin/ImageUpload";
import { supabase } from "@/lib/supabase";
import { defaultIdentity, defaultPayment } from "@/mocks/siteContent";
import { useSite } from "@/context/SiteContext";
import type { PaymentInfo, SiteIdentity } from "@/lib/types";

export default function AdminContenido() {
  const { t } = useTranslation();
  const { reload } = useSite();
  const [identity, setIdentity] = useState<SiteIdentity>(defaultIdentity);
  const [payment, setPayment] = useState<PaymentInfo>(defaultPayment);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase.from("site_settings").select("key, value");
        if (err) throw err;
        if (!active) return;
        const map: Record<string, unknown> = {};
        (data ?? []).forEach((row: { key: string; value: unknown }) => {
          map[row.key] = row.value;
        });
        if (map.identity) setIdentity({ ...defaultIdentity, ...(map.identity as object) });
        if (map.payment) setPayment({ ...defaultPayment, ...(map.payment as object) });
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
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(id);
  }, [toast]);

  const setI = (patch: Partial<SiteIdentity>) => setIdentity((prev) => ({ ...prev, ...patch }));
  const setP = (patch: Partial<PaymentInfo>) => setPayment((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    const { error: err } = await supabase
      .from("site_settings")
      .upsert(
        [
          { key: "identity", value: identity },
          { key: "payment", value: payment },
        ],
        { onConflict: "key" },
      );
    setSaving(false);
    if (err) {
      setToast(t("admin.common.errorGeneric"));
      return;
    }
    setToast(t("admin.common.savedToast"));
    reload();
  };

  const saveButton = (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving || loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap disabled:opacity-60 dark:text-foreground-950"
    >
      <i className={saving ? "ri-loader-4-line animate-spin" : "ri-save-line"} />
      {saving ? t("admin.common.saving") : t("admin.common.save")}
    </button>
  );

  return (
    <div>
      <AdminPageHeader title={t("admin.content.title")} subtitle={t("admin.content.subtitle")} action={saveButton} />

      {error && (
        <Card className="p-5 mb-4">
          <p className="text-sm text-accent-900">{t("admin.common.errorGeneric")}</p>
        </Card>
      )}

      {loading ? (
        <Card className="flex items-center justify-center py-16">
          <i className="ri-loader-4-line animate-spin text-2xl text-primary-600" />
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="p-5 md:p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
              {t("admin.content.identityTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t("admin.content.brand")}>
                <TextInput value={identity.brand} onChange={(e) => setI({ brand: e.target.value })} />
              </Field>
              <Field label={t("admin.content.therapist")}>
                <TextInput value={identity.therapist} onChange={(e) => setI({ therapist: e.target.value })} />
              </Field>
              <Field label={t("admin.content.taglineEs")}>
                <TextInput value={identity.tagline_es} onChange={(e) => setI({ tagline_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.taglineEn")}>
                <TextInput value={identity.tagline_en} onChange={(e) => setI({ tagline_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.descEs")} className="sm:col-span-2">
                <TextArea rows={2} value={identity.description_es} onChange={(e) => setI({ description_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.descEn")} className="sm:col-span-2">
                <TextArea rows={2} value={identity.description_en} onChange={(e) => setI({ description_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.whatsappNumber")} hint="50688767344">
                <TextInput value={identity.whatsappNumber} onChange={(e) => setI({ whatsappNumber: e.target.value })} />
              </Field>
              <Field label={t("admin.content.whatsappDisplay")}>
                <TextInput value={identity.whatsappDisplay} onChange={(e) => setI({ whatsappDisplay: e.target.value })} />
              </Field>
              <Field label={t("admin.content.email")}>
                <TextInput value={identity.email} onChange={(e) => setI({ email: e.target.value })} />
              </Field>
              <Field label={t("admin.content.meetLink")}>
                <TextInput value={identity.meetLink} onChange={(e) => setI({ meetLink: e.target.value })} />
              </Field>
              <Field label={t("admin.content.locationEs")}>
                <TextInput value={identity.location_es} onChange={(e) => setI({ location_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.locationEn")}>
                <TextInput value={identity.location_en} onChange={(e) => setI({ location_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.scheduleEs")}>
                <TextInput value={identity.schedule_es} onChange={(e) => setI({ schedule_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.scheduleEn")}>
                <TextInput value={identity.schedule_en} onChange={(e) => setI({ schedule_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.timezone")} hint="America/Costa_Rica" className="sm:col-span-2">
                <TextInput value={identity.timezone} onChange={(e) => setI({ timezone: e.target.value })} />
              </Field>
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
              {t("admin.content.aboutTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <ImageUpload
                  value={identity.aboutImageUrl}
                  onChange={(url) => setI({ aboutImageUrl: url })}
                  label={t("admin.content.aboutImage")}
                  hint={t("admin.content.aboutImageHint")}
                  folder="about"
                  previewClass="w-28 h-36"
                />
              </div>
              <Field label={t("admin.content.aboutTitleEs")}>
                <TextInput value={identity.aboutTitle_es} onChange={(e) => setI({ aboutTitle_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.aboutTitleEn")}>
                <TextInput value={identity.aboutTitle_en} onChange={(e) => setI({ aboutTitle_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.aboutTextEs")} hint={t("admin.common.onePerLine")} className="sm:col-span-2">
                <TextArea rows={4} value={identity.aboutText_es} onChange={(e) => setI({ aboutText_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.aboutTextEn")} hint={t("admin.common.onePerLine")} className="sm:col-span-2">
                <TextArea rows={4} value={identity.aboutText_en} onChange={(e) => setI({ aboutText_en: e.target.value })} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end">{saveButton}</div>
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground-950 mb-4">
              {t("admin.content.paymentTitle")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t("admin.content.sinpeName")}>
                <TextInput value={payment.sinpeName} onChange={(e) => setP({ sinpeName: e.target.value })} />
              </Field>
              <Field label={t("admin.content.sinpePhone")}>
                <TextInput value={payment.sinpePhone} onChange={(e) => setP({ sinpePhone: e.target.value })} />
              </Field>
              <Field label={t("admin.content.bank")}>
                <TextInput value={payment.bank} onChange={(e) => setP({ bank: e.target.value })} />
              </Field>
              <Field label={t("admin.content.bankAccount")}>
                <TextInput value={payment.bankAccount} onChange={(e) => setP({ bankAccount: e.target.value })} />
              </Field>
              <Field label={t("admin.content.bankAccountName")} className="sm:col-span-2">
                <TextInput value={payment.bankAccountName} onChange={(e) => setP({ bankAccountName: e.target.value })} />
              </Field>
              <Field label={t("admin.content.paymentIntroEs")} className="sm:col-span-2">
                <TextArea rows={2} value={payment.intro_es} onChange={(e) => setP({ intro_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.paymentIntroEn")} className="sm:col-span-2">
                <TextArea rows={2} value={payment.intro_en} onChange={(e) => setP({ intro_en: e.target.value })} />
              </Field>
              <Field label={t("admin.content.ivaNoteEs")} className="sm:col-span-2">
                <TextArea rows={2} value={payment.ivaNote_es} onChange={(e) => setP({ ivaNote_es: e.target.value })} />
              </Field>
              <Field label={t("admin.content.ivaNoteEn")} className="sm:col-span-2">
                <TextArea rows={2} value={payment.ivaNote_en} onChange={(e) => setP({ ivaNote_en: e.target.value })} />
              </Field>
            </div>
            <div className="mt-6 flex justify-end">{saveButton}</div>
          </Card>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
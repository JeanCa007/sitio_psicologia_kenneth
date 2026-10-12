import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSite } from "@/context/SiteContext";
import { useLang } from "@/hooks/useLang";

export default function Footer() {
  const { t } = useTranslation();
  const { identity } = useSite();
  const lang = useLang();

  const description = lang === "en" ? identity.description_en : identity.description_es;
  const location = lang === "en" ? identity.location_en : identity.location_es;
  const schedule = lang === "en" ? identity.schedule_en : identity.schedule_es;

  return (
    <footer className="w-full bg-primary-950 text-background-100">
      <div className="mx-auto w-full px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent-500 text-primary-950 text-lg">
                <i className="ri-seedling-line" />
              </span>
              <span className="font-heading text-xl font-semibold">{identity.brand}</span>
            </div>
            <p className="mt-4 text-sm text-background-300 max-w-md leading-relaxed">{description}</p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={`https://wa.me/${identity.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 text-background-100 hover:bg-accent-500 hover:text-primary-950 cursor-pointer transition-colors"
                aria-label="WhatsApp"
              >
                <i className="ri-whatsapp-line text-lg" />
              </a>
              <a
                href={`mailto:${identity.email}`}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 text-background-100 hover:bg-accent-500 hover:text-primary-950 cursor-pointer transition-colors"
                aria-label="Correo"
              >
                <i className="ri-mail-line text-lg" />
              </a>
              <a
                href={identity.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-background-50/10 text-background-100 hover:bg-accent-500 hover:text-primary-950 cursor-pointer transition-colors"
                aria-label="Google Meet"
              >
                <i className="ri-vidicon-line text-lg" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-background-50 uppercase tracking-wide">
              {t("footer.nav")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/servicios" className="text-background-300 hover:text-accent-300 cursor-pointer">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-background-300 hover:text-accent-300 cursor-pointer">
                  {t("nav.courses")}
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-background-300 hover:text-accent-300 cursor-pointer">
                  {t("nav.prices")}
                </Link>
              </li>
              <li>
                <Link to="/reservar" className="text-background-300 hover:text-accent-300 cursor-pointer">
                  {t("nav.book")}
                </Link>
              </li>
              <li>
                <Link to="/sobre-mi" className="text-background-300 hover:text-accent-300 cursor-pointer">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold text-background-50 uppercase tracking-wide">
              {t("footer.contact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-background-300">
              <li className="flex items-start gap-2">
                <i className="ri-whatsapp-line mt-0.5 text-accent-300" />
                <span>{identity.whatsappDisplay}</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-mail-line mt-0.5 text-accent-300" />
                <span>{identity.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-map-pin-line mt-0.5 text-accent-300" />
                <span>{location}</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="ri-time-line mt-0.5 text-accent-300" />
                <span>{schedule}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-background-50/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-background-400">
          <p>
            © {new Date().getFullYear()} {identity.brand}. {t("footer.rights")}
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-background-50/20 text-background-200 text-xs font-medium hover:bg-accent-500 hover:text-primary-950 hover:border-accent-500 cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-lock-line text-sm" />
            <span>{t("footer.adminLink")}</span>
          </Link>
        </div>
        <p className="mt-3 text-xs text-background-400">{t("footer.emergency")}</p>
      </div>
    </footer>
  );
}
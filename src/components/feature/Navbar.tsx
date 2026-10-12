import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/feature/LanguageSwitcher";
import { useSite } from "@/context/SiteContext";

export default function Navbar() {
  const { t } = useTranslation();
  const { identity } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/servicios", label: t("nav.services") },
    { to: "/cursos", label: t("nav.courses") },
    { to: "/precios", label: t("nav.prices") },
    { to: "/sobre-mi", label: t("nav.about") },
    { to: "/contacto", label: t("nav.contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled || open
          ? "bg-background-50/95 backdrop-blur border-b border-background-200/70"
          : "bg-background-50/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 md:h-20 w-full items-center justify-between gap-3 px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 cursor-pointer shrink-0">
          <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 text-background-50 text-lg">
            <i className="ri-seedling-line" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg md:text-xl font-semibold text-foreground-950">
              {identity.brand}
            </span>
            <span className="hidden sm:block text-[11px] text-foreground-500 font-sans">
              {t("nav.services")} · {t("nav.about")}
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm cursor-pointer transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-primary-700 font-semibold bg-primary-100/70"
                    : "text-foreground-700 hover:text-primary-700 hover:bg-background-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher compact />
          <a
            href={`https://wa.me/${identity.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-background-100 text-primary-700 hover:bg-primary-100 cursor-pointer transition-colors"
            aria-label={t("nav.whatsapp")}
          >
            <i className="ri-whatsapp-line text-lg" />
          </a>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors dark:text-foreground-950"
          >
            <i className="ri-calendar-check-line" />
            {t("nav.book")}
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-foreground-900 cursor-pointer"
            aria-label={t("nav.openMenu")}
          >
            <i className={open ? "ri-close-line text-2xl" : "ri-menu-3-line text-2xl"} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-background-200/70 bg-background-50 px-4 pb-5 pt-3">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-3 rounded-md text-base cursor-pointer transition-colors ${
                    isActive
                      ? "text-primary-700 font-semibold bg-primary-100/70"
                      : "text-foreground-800 hover:bg-background-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Link
              to="/reservar"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-4 py-3 text-sm font-semibold text-background-50 cursor-pointer dark:text-foreground-950"
            >
              <i className="ri-calendar-check-line" />
              {t("nav.book")}
            </Link>
            <a
              href={`https://wa.me/${identity.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-300 bg-background-50 px-4 py-3 text-sm font-semibold text-primary-700 cursor-pointer"
            >
              <i className="ri-whatsapp-line" />
              {t("nav.whatsapp")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
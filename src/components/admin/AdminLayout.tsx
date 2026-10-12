import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { claimAdminAccess, getAdminsCount } from "@/lib/admin";
import { SiteProvider, useSite } from "@/context/SiteContext";

function AdminShell({ signOut }: { signOut: () => Promise<void> }) {
  const { t } = useTranslation();
  const { identity } = useSite();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const nav = [
    { to: "/admin", label: t("admin.nav.dashboard"), icon: "ri-dashboard-line", end: true },
    { to: "/admin/citas", label: t("admin.nav.appointments"), icon: "ri-calendar-check-line" },
    { to: "/admin/mensajes", label: t("admin.nav.messages"), icon: "ri-mail-line" },
    { to: "/admin/servicios", label: t("admin.nav.services"), icon: "ri-briefcase-line" },
    { to: "/admin/cursos", label: t("admin.nav.courses"), icon: "ri-book-open-line" },
    { to: "/admin/horarios", label: t("admin.nav.availability"), icon: "ri-time-line" },
    { to: "/admin/contenido", label: t("admin.nav.content"), icon: "ri-edit-box-line" },
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors cursor-pointer ${
      isActive
        ? "bg-accent-500 text-primary-950 font-semibold"
        : "text-background-200 hover:bg-background-50/10 hover:text-background-50"
    }`;

  return (
    <div className="min-h-screen bg-background-100 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-primary-950 px-4 py-6">
        <Link to="/admin" className="flex items-center gap-2 px-2 cursor-pointer">
          <span className="w-9 h-9 flex items-center justify-center rounded-xl bg-accent-500 text-primary-950 text-lg">
            <i className="ri-seedling-line" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-semibold text-background-50">{identity.brand}</span>
            <span className="text-[11px] text-background-400">{t("admin.nav.panel")}</span>
          </span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              <i className={`${item.icon} text-lg`} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 flex flex-col gap-1 border-t border-background-50/10">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-background-200 hover:bg-background-50/10 hover:text-background-50 cursor-pointer"
          >
            <i className="ri-external-link-line text-lg" />
            {t("admin.nav.viewSite")}
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-background-200 hover:bg-background-50/10 hover:text-background-50 cursor-pointer text-left"
          >
            <i className="ri-logout-box-r-line text-lg" />
            {t("admin.nav.signOut")}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 bg-primary-950 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-accent-500 text-primary-950">
              <i className="ri-seedling-line" />
            </span>
            <span className="font-heading text-base font-semibold text-background-50">{identity.brand}</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-10 h-10 flex items-center justify-center rounded-md text-background-100 cursor-pointer"
            aria-label={t("admin.nav.menu")}
          >
            <i className={open ? "ri-close-line text-2xl" : "ri-menu-3-line text-2xl"} />
          </button>
        </header>

        {open && (
          <div className="lg:hidden bg-primary-950 px-3 pb-4 border-t border-background-50/10">
            <nav className="flex flex-col gap-1 pt-3">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                  <i className={`${item.icon} text-lg`} />
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/"
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-background-200 hover:bg-background-50/10 cursor-pointer"
              >
                <i className="ri-external-link-line text-lg" />
                {t("admin.nav.viewSite")}
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-background-200 hover:bg-background-50/10 cursor-pointer text-left"
              >
                <i className="ri-logout-box-r-line text-lg" />
                {t("admin.nav.signOut")}
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 w-full px-4 md:px-8 py-6 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function RestrictedScreen({
  userId,
  onClaimed,
  signOut,
}: {
  userId: string | null;
  onClaimed: () => void;
  signOut: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const [count, setCount] = useState<number | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminsCount().then((value) => setCount(value));
  }, []);

  const handleClaim = async () => {
    if (!userId) return;
    setClaiming(true);
    setError("");
    try {
      await claimAdminAccess(userId);
      onClaimed();
    } catch {
      setError(t("admin.login.claimError"));
      setClaiming(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4">
      <div className="w-full max-w-md rounded-lg border border-background-200/80 bg-background-50 p-8 text-center">
        <span className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-accent-100 text-accent-700 text-2xl">
          <i className="ri-lock-2-line" />
        </span>
        <h1 className="mt-4 font-heading text-xl font-semibold text-foreground-950">
          {count === 0 ? t("admin.login.claimTitle") : t("admin.login.restrictedTitle")}
        </h1>
        <p className="mt-2 text-sm text-foreground-600">
          {count === 0 ? t("admin.login.claimText") : t("admin.login.restrictedText")}
        </p>

        {error && <p className="mt-4 rounded-md bg-accent-100 px-4 py-3 text-sm text-accent-900">{error}</p>}

        <div className="mt-6 flex flex-col gap-3">
          {count === 0 && (
            <button
              type="button"
              onClick={handleClaim}
              disabled={claiming}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-5 py-3 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap disabled:opacity-60 dark:text-foreground-950"
            >
              <i className={claiming ? "ri-loader-4-line animate-spin" : "ri-shield-keyhole-line"} />
              {claiming ? t("admin.login.claiming") : t("admin.login.claimBtn")}
            </button>
          )}
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-background-300 px-5 py-3 text-sm font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-r-line" />
            {t("admin.login.signOut")}
          </button>
          <Link to="/" className="text-sm text-primary-700 hover:underline cursor-pointer">
            {t("admin.login.backSite")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { loading, session, isAdmin, checking, userId, refresh, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100">
        <i className="ri-loader-4-line animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (checking && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-100">
        <i className="ri-loader-4-line animate-spin text-3xl text-primary-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <RestrictedScreen userId={userId} onClaimed={refresh} signOut={signOut} />;
  }

  return (
    <SiteProvider>
      <AdminShell signOut={signOut} />
    </SiteProvider>
  );
}
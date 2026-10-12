import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  claimAdminAccess,
  getAdminsCount,
  getCurrentUserId,
  signInAdmin,
  signUpAdmin,
} from "@/lib/admin";

const inputClass =
  "w-full rounded-md border border-background-300/70 bg-background-50 px-4 py-3 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200";

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading, session, isAdmin } = useAdminAuth();

  const [needsSetup, setNeedsSetup] = useState(false);
  const [mode, setMode] = useState<"login" | "setup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    getAdminsCount().then((count) => {
      if (count === 0) setNeedsSetup(true);
    });
  }, []);

  useEffect(() => {
    if (session && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [session, isAdmin, navigate]);

  if (!loading && session && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t("admin.common.required"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await signInAdmin(email.trim(), password);
      navigate("/admin", { replace: true });
    } catch {
      setError(t("admin.login.error"));
      setSubmitting(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t("admin.common.required"));
      return;
    }
    if (password.length < 6) {
      setError(t("admin.login.passwordMin"));
      return;
    }
    if (password !== confirm) {
      setError(t("admin.login.passwordMismatch"));
      return;
    }
    setSubmitting(true);
    setError("");
    setInfo("");
    try {
      const hasSession = await signUpAdmin(email.trim(), password);
      if (hasSession) {
        const userId = await getCurrentUserId();
        if (userId) await claimAdminAccess(userId);
        navigate("/admin", { replace: true });
      } else {
        setInfo(t("admin.login.confirmEmail"));
        setMode("login");
        setSubmitting(false);
      }
    } catch {
      setError(t("admin.login.registerError"));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-500 text-background-50 text-2xl dark:text-foreground-950">
            <i className="ri-seedling-line" />
          </span>
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground-950">
            {mode === "setup" ? t("admin.login.setupTitle") : t("admin.login.title")}
          </h1>
          <p className="mt-2 text-sm text-foreground-600">
            {mode === "setup" ? t("admin.login.setupText") : t("admin.login.subtitle")}
          </p>
        </div>

        <form
          onSubmit={mode === "setup" ? handleSetup : handleLogin}
          className="rounded-lg border border-background-200/80 bg-background-50 p-6 md:p-8"
        >
          <div className="space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-foreground-800 mb-1.5">
                {t("admin.login.email")}
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("admin.login.emailPh")}
                className={inputClass}
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-foreground-800 mb-1.5">
                {t("admin.login.password")}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("admin.login.passwordPh")}
                className={inputClass}
                autoComplete={mode === "setup" ? "new-password" : "current-password"}
              />
            </label>
            {mode === "setup" && (
              <label className="block">
                <span className="block text-sm font-semibold text-foreground-800 mb-1.5">
                  {t("admin.login.confirmPassword")}
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                />
              </label>
            )}
          </div>

          {info && <p className="mt-4 rounded-md bg-secondary-100 px-4 py-3 text-sm text-secondary-900">{info}</p>}
          {error && <p className="mt-4 rounded-md bg-accent-100 px-4 py-3 text-sm text-accent-900">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary-500 px-6 py-3.5 text-sm font-semibold text-background-50 hover:bg-primary-600 cursor-pointer whitespace-nowrap transition-colors disabled:opacity-60 dark:text-foreground-950"
          >
            <i
              className={
                submitting
                  ? "ri-loader-4-line animate-spin"
                  : mode === "setup"
                    ? "ri-user-add-line"
                    : "ri-login-circle-line"
              }
            />
            {submitting
              ? mode === "setup"
                ? t("admin.login.registering")
                : t("admin.login.loading")
              : mode === "setup"
                ? t("admin.login.registerBtn")
                : t("admin.login.submit")}
          </button>

          {needsSetup && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode((m) => (m === "setup" ? "login" : "setup"));
                  setError("");
                  setInfo("");
                }}
                className="text-sm font-semibold text-primary-700 hover:underline cursor-pointer"
              >
                {mode === "setup" ? t("admin.login.alreadyHaveAccount") : t("admin.login.createAccount")}
              </button>
            </div>
          )}

          <div className="mt-5 text-center border-t border-background-200/70 pt-4">
            <Link to="/" className="text-sm text-foreground-600 hover:text-primary-700 cursor-pointer">
              <i className="ri-arrow-left-line mr-1" />
              {t("admin.login.backSite")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
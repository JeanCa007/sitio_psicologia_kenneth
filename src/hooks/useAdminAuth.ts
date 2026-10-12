import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin, signOutAdmin } from "@/lib/admin";

export interface AdminAuthState {
  loading: boolean;
  session: Session | null;
  userId: string | null;
  isAdmin: boolean;
  checking: boolean;
  refresh: () => void;
  signOut: () => Promise<void>;
}

export function useAdminAuth(): AdminAuthState {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    let active = true;
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    setChecking(true);
    checkIsAdmin()
      .then((value) => {
        if (active) setIsAdmin(value);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, [userId, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const signOut = useCallback(async () => {
    await signOutAdmin();
    setIsAdmin(false);
  }, []);

  return { loading, session, userId, isAdmin, checking, refresh, signOut };
}
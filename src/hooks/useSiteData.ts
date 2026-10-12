import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { defaultIdentity, defaultPayment } from "@/mocks/siteContent";
import { fallbackAvailability, fallbackCourses, fallbackServices } from "@/mocks/fallbackData";
import type {
  AvailabilityRow,
  CourseRow,
  PaymentInfo,
  ServiceRow,
  SiteIdentity,
} from "@/lib/types";

interface AsyncState<T> {
  data: T;
  loading: boolean;
  error: boolean;
  reload: () => void;
}

export function useSettings(): {
  identity: SiteIdentity;
  payment: PaymentInfo;
  loading: boolean;
  error: boolean;
  reload: () => void;
} {
  const [identity, setIdentity] = useState<SiteIdentity>(defaultIdentity);
  const [payment, setPayment] = useState<PaymentInfo>(defaultPayment);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from("site_settings")
          .select("key, value");
        if (err) throw err;
        if (!active) return;
        if (data) {
          const map: Record<string, unknown> = {};
          data.forEach((row: { key: string; value: unknown }) => {
            map[row.key] = row.value;
          });
          if (map.identity) setIdentity({ ...defaultIdentity, ...(map.identity as object) });
          if (map.payment) setPayment({ ...defaultPayment, ...(map.payment as object) });
        }
        setError(false);
      } catch {
        if (active) {
          setIdentity(defaultIdentity);
          setPayment(defaultPayment);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tick]);

  return { identity, payment, loading, error, reload };
}

export function useServices(): AsyncState<ServiceRow[]> {
  const [data, setData] = useState<ServiceRow[]>(fallbackServices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data: rows, error: err } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });
        if (err) throw err;
        if (!active) return;
        setData(rows && rows.length ? (rows as ServiceRow[]) : fallbackServices);
        setError(false);
      } catch {
        if (active) {
          setData(fallbackServices);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tick]);

  return { data, loading, error, reload };
}

export function useCourses(): AsyncState<CourseRow[]> {
  const [data, setData] = useState<CourseRow[]>(fallbackCourses);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data: rows, error: err } = await supabase
          .from("courses")
          .select("*")
          .eq("is_active", true)
          .order("start_date", { ascending: true });
        if (err) throw err;
        if (!active) return;
        setData(rows && rows.length ? (rows as CourseRow[]) : fallbackCourses);
        setError(false);
      } catch {
        if (active) {
          setData(fallbackCourses);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tick]);

  return { data, loading, error, reload };
}

export function useAvailability(): AsyncState<AvailabilityRow[]> {
  const [data, setData] = useState<AvailabilityRow[]>(fallbackAvailability);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((v) => v + 1), []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { data: rows, error: err } = await supabase
          .from("availability")
          .select("*")
          .eq("is_active", true)
          .order("weekday", { ascending: true });
        if (err) throw err;
        if (!active) return;
        setData(rows && rows.length ? (rows as AvailabilityRow[]) : fallbackAvailability);
        setError(false);
      } catch {
        if (active) {
          setData(fallbackAvailability);
          setError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [tick]);

  return { data, loading, error, reload };
}
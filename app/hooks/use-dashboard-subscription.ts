import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardData } from "../components/admin-dashboard";

export function useDashboardSubscription(token: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFetchingRef = useRef(false);

  const fetchDashboard = useCallback(async (isInitial = false) => {
    if (!token || isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    if (isInitial) setIsLoading(true);

    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: { "x-admin-token": token },
      });
      const nextData = await response.json();

      if (!response.ok) {
        setError(nextData.message ?? "تعذر فتح لوحة التحكم.");
        if (isInitial) setData(null);
      } else {
        setData(nextData);
        setError(null);
        setIsReconnecting(false);
      }
    } catch (err) {
      if (isInitial) {
        setError("حدث خطأ أثناء جلب البيانات.");
      } else {
        setIsReconnecting(true);
      }
    } finally {
      if (isInitial) setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [token]);

  const reload = useCallback(() => {
    return fetchDashboard(false);
  }, [fetchDashboard]);

  useEffect(() => {
    if (!token) {
      setData(null);
      setError(null);
      setIsLoading(false);
      setIsReconnecting(false);
      return;
    }

    fetchDashboard(true);

    const startPolling = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchDashboard(false);
        }
      }, 5000);
    };

    const stopPolling = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboard(false);
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, fetchDashboard]);

  return { data, isLoading, error, isReconnecting, reload };
}

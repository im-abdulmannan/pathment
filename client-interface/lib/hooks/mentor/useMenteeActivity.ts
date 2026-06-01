'use client';

import { useState, useEffect, useCallback } from 'react';
import { activityApi } from '@/lib/services/activity-api';
import type {
  ActivitySummary,
  DailySession,
  RecentEvent,
} from '@/lib/types/activity';

export interface UseMenteeActivityReturn {
  summary: ActivitySummary | null;
  dailySessions: DailySession[];
  recentEvents: RecentEvent[];
  loading: boolean;
  days: number;
  setDays: (d: number) => void;
  refetch: () => void;
}

export function useMenteeActivity(menteeId: string | null): UseMenteeActivityReturn {
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [dailySessions, setDailySessions] = useState<DailySession[]>([]);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetch = useCallback(async () => {
    if (!menteeId) return;
    setLoading(true);
    try {
      // apiClient.get<T> returns response.data which is { success, message, data: MenteeActivityResponse }
      const res = await activityApi.getMenteeSummary(menteeId, days) as unknown as { data: { summary: ActivitySummary; dailySessions: DailySession[]; recentEvents: RecentEvent[] } };
      const payload = res?.data;
      setSummary(payload?.summary ?? null);
      setDailySessions(payload?.dailySessions ?? []);
      setRecentEvents(payload?.recentEvents ?? []);
    } catch {
      // Non-fatal
    } finally {
      setLoading(false);
    }
  }, [menteeId, days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Auto-refresh every 5 min so the card stays live without a page reload
  useEffect(() => {
    const id = setInterval(fetch, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [fetch]);

  // Refresh when mentor returns to the tab
  useEffect(() => {
    const onFocus = () => fetch();
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetch();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [fetch]);

  return { summary, dailySessions, recentEvents, loading, days, setDays, refetch: fetch };
}

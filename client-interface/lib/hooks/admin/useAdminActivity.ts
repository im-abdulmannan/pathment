'use client';

import { useState, useEffect, useCallback } from 'react';
import { activityApi } from '@/lib/services/activity-api';
import type { AdminActivityOverview, MenteeActivityStat } from '@/lib/types/activity';

export interface UseAdminActivityReturn {
  overview: AdminActivityOverview | null;
  loading: boolean;
  days: number;
  setDays: (d: number) => void;
  search: string;
  setSearch: (s: string) => void;
  filtered: MenteeActivityStat[];
  refetch: () => void;
}

export function useAdminActivity(): UseAdminActivityReturn {
  const [overview, setOverview] = useState<AdminActivityOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [search, setSearch] = useState('');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      // apiClient.get<T> returns response.data which is { success, message, data: AdminActivityOverview }
      const res = await activityApi.getAdminOverview(days) as unknown as { data: AdminActivityOverview };
      setOverview(res?.data ?? null);
    } catch {
      // Non-fatal
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filtered = (overview?.menteeStats ?? []).filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.user.firstName.toLowerCase().includes(q) ||
      m.user.lastName.toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q)
    );
  });

  return { overview, loading, days, setDays, search, setSearch, filtered, refetch: fetch };
}

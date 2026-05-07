/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { matchingApi } from '@/lib/services/enrollment-api';
import { useAuth } from '@/lib/context/AuthContext';
import { toast } from 'sonner';

export interface UseMentorProgramsReturn {
  programs: any[];
  loading: boolean;
  fetchPrograms: () => Promise<void>;
}

export function useMentorPrograms(): UseMentorProgramsReturn {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrograms = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      // Fetch programs via level assignments (source of truth — works even with 0 mentees)
      const assignedResponse = await matchingApi.getMentorAssignedLevels();
      const assignedPrograms: any[] = assignedResponse?.data?.programs || assignedResponse?.programs || [];

      // Also fetch active matches to compute mentee counts and average progress
      const matchesResponse = await matchingApi.getMatches({ mentorId: user.id, status: 'active' });
      const matches: any[] = matchesResponse?.data?.matches || matchesResponse?.matches || [];

      // Build a per-program stats map from matches
      const statsMap = new Map<string, { menteeCount: number; totalProgress: number }>();
      for (const match of matches) {
        const progId = match.enrollment?.program?.id || match.enrollment?.programId;
        if (!progId) continue;
        if (!statsMap.has(progId)) statsMap.set(progId, { menteeCount: 0, totalProgress: 0 });
        const entry = statsMap.get(progId)!;
        entry.menteeCount += 1;
        entry.totalProgress += parseFloat(match.enrollment?.overallProgressPercentage || 0);
      }

      const programList = assignedPrograms.map((prog: any) => {
        const stats = statsMap.get(prog.id);
        const menteeCount = stats?.menteeCount ?? 0;
        const avgProgress = menteeCount > 0 ? Math.round(stats!.totalProgress / menteeCount) : 0;
        return { ...prog, menteeCount, avgProgress };
      });

      setPrograms(programList);
    } catch (error: any) {
      console.error('Failed to fetch programs:', error);
      toast.error('Failed to load your programs');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchPrograms();
    }
  }, [user?.id, fetchPrograms]);

  return { programs, loading, fetchPrograms };
}

'use client';

/**
 * ActivityTrackerMount
 *
 * A zero-UI component that mounts the activity tracker.
 * Include once inside any authenticated role layout.
 */
import { useActivityTracker } from '@/lib/hooks/shared/useActivityTracker';

export function ActivityTrackerMount() {
  useActivityTracker();
  return null;
}

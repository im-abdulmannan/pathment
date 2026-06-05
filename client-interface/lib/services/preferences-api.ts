import { apiClient } from './api-client';

/** Persist a namespaced group of settings toggles into user_settings.preferences. */
export const preferencesApi = {
  update: (group: 'notifications' | 'learning' | 'system' | 'userManagement', values: Record<string, unknown>) =>
    apiClient.patch('/profile/preferences', { group, values }),
};

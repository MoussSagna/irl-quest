import type { HealthResponse } from '@irl-quest/types';

export const createApiClient = (baseUrl: string) => ({
  health: async (): Promise<HealthResponse> => (await fetch(`${baseUrl}/health`)).json(),
});

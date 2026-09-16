import * as SecureStore from 'expo-secure-store';
import { createApiClient } from '@irl-quest/api-client';

const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787';
const cookieKey = 'irl-quest-session-cookie';

export const apiClient = createApiClient(baseUrl, {
  get: () => SecureStore.getItemAsync(cookieKey),
  set: (cookie) => SecureStore.setItemAsync(cookieKey, cookie),
  clear: () => SecureStore.deleteItemAsync(cookieKey),
});

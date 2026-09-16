import * as SecureStore from 'expo-secure-store';
import { createApiClient } from '@irl-quest/api-client';
import { ApiConfigurationError, getApiBaseUrl } from './config';

export const apiConfiguration = (() => {
  try {
    return { baseUrl: getApiBaseUrl(), error: null };
  } catch (error) {
    return {
      baseUrl: 'http://invalid-api-configuration.local',
      error: error instanceof ApiConfigurationError
        ? error
        : new ApiConfigurationError('The mobile API URL is invalid.'),
    };
  }
})();

const cookieKey = 'irl-quest-session-cookie';

export const apiClient = createApiClient(apiConfiguration.baseUrl, {
  get: () => SecureStore.getItemAsync(cookieKey),
  set: (cookie) => SecureStore.setItemAsync(cookieKey, cookie),
  clear: () => SecureStore.deleteItemAsync(cookieKey),
});

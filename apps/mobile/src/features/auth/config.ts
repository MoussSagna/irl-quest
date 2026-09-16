export class ApiConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiConfigurationError';
  }
}

export function getApiBaseUrl(rawValue = process.env.EXPO_PUBLIC_API_URL) {
  const value = rawValue?.trim();
  if (!value) {
    throw new ApiConfigurationError(
      'EXPO_PUBLIC_API_URL is missing. Set it to the API address reachable by this device.',
    );
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ApiConfigurationError(
      'EXPO_PUBLIC_API_URL is invalid. Use a complete URL such as http://<MAC_LAN_IP>:8787.',
    );
  }

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.pathname !== '/') {
    throw new ApiConfigurationError(
      'EXPO_PUBLIC_API_URL must be an HTTP(S) origin such as http://<MAC_LAN_IP>:8787.',
    );
  }

  return value.replace(/\/$/, '');
}

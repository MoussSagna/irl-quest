import { ApiConfigurationError, getApiBaseUrl } from '../config';

describe('mobile API configuration', () => {
  it('accepts a complete HTTP origin and removes a trailing slash', () => {
    expect(getApiBaseUrl('http://192.168.1.9:8787/')).toBe('http://192.168.1.9:8787');
  });

  it('rejects a missing or malformed environment value explicitly', () => {
    expect(() => getApiBaseUrl()).toThrow(ApiConfigurationError);
    expect(() => getApiBaseUrl('EXPO_PUBLIC_API_URL=http://192.168.1.9:8787')).toThrow(ApiConfigurationError);
  });
});

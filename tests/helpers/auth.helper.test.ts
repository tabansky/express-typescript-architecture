import { generateBearerToken, getTokenValidityHours } from '../../src/helpers/auth.helper';

describe('Auth helper', () => {
  test('generateBearerToken', () => {
    expect(generateBearerToken()).toHaveLength(340);
  });

  test('generateBearerToken', () => {
    expect(getTokenValidityHours(false)).toBe(24 * 60 * 60 * 1000);
    expect(getTokenValidityHours(true)).toBe(72 * 60 * 60 * 1000);
  });
});

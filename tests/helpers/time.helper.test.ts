import { getHoursInMs } from '../../src/helpers/time.helper';

describe('Auth helper', () => {
  test('getHoursInMs', () => {
    expect(getHoursInMs(12)).toBe(12 * 60 * 60 * 1000);
  });
});

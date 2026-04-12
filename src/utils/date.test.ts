import { toDateKey } from './date'

test('formats a date as a stable yyyy-mm-dd key', () => {
  expect(toDateKey(new Date('2026-04-12T08:00:00Z'))).toBe('2026-04-12')
})

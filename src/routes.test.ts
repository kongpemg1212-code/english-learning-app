import { getRouteFromHash } from './routes'

test('resolves the story route', () => {
  expect(getRouteFromHash('#/story')).toBe('story')
})

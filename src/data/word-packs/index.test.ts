import { loadDefaultPack } from './index'

test('loads a YLE starter pack with topics and words', async () => {
  const pack = await loadDefaultPack()

  expect(pack.meta.id).toBe('yle-core-v1')
  expect(pack.topics.length).toBeGreaterThanOrEqual(15)
  expect(pack.words.length).toBeGreaterThanOrEqual(350)
  expect(pack.topics.some((topic) => topic.id === 'weather')).toBe(true)
  expect(pack.words.some((word) => word.word === 'giraffe')).toBe(true)
})

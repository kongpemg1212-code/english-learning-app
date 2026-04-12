import { normalizeImportedPack } from './normalizeImportedPack'

test('normalizes imported rows into the internal word-pack format', () => {
  const pack = normalizeImportedPack({
    name: 'PEP Unit 1',
    rows: [{ word: 'cat', meaningZh: '猫', unit: 'Unit 1' }],
  })

  expect(pack.meta.source).toBe('textbook')
  expect(pack.words[0].normalizedWord).toBe('cat')
})

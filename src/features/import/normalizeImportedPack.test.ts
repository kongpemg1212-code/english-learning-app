import { normalizeImportedPack } from './normalizeImportedPack'

test('normalizes imported rows into the internal word-pack format', () => {
  const pack = normalizeImportedPack({
    name: 'PEP Unit 1',
    rows: [
      {
        word: 'cat',
        meaningZh: '猫',
        unit: 'Unit 1',
        image: ' https://example.com/cat.png ',
        audio: ' https://example.com/cat.mp3 ',
        example: ' This is a cat. ',
        exampleZh: ' 这是一只猫。 ',
      },
    ],
  })

  expect(pack.meta.source).toBe('textbook')
  expect(pack.words[0].normalizedWord).toBe('cat')
  expect(pack.words[0].visualKey).toBe('cat')
  expect(pack.words[0].image).toBe('https://example.com/cat.png')
  expect(pack.words[0].audio).toBe('https://example.com/cat.mp3')
  expect(pack.words[0].exampleZh).toBe('这是一只猫。')
})

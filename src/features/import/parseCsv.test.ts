import { parseCsv } from './parseCsv'

test('parses a simple csv import template with sentence fields', () => {
  const rows = parseCsv(
    'word,meaningZh,topic,example,exampleZh\ncat,猫,animals,"This is a cat.","这是一只猫。"\n',
  )

  expect(rows).toHaveLength(1)
  expect(rows[0].word).toBe('cat')
  expect(rows[0].example).toBe('This is a cat.')
})

import animals from '../../data/word-packs/yle-core/topics/animals.json'
import allWords from '../../data/word-packs/yle-core/all-words.json'
import colours from '../../data/word-packs/yle-core/topics/colours.json'
import foodAndDrink from '../../data/word-packs/yle-core/topics/food-and-drink.json'
import home from '../../data/word-packs/yle-core/topics/home.json'
import school from '../../data/word-packs/yle-core/topics/school.json'
import toys from '../../data/word-packs/yle-core/topics/toys.json'
import transport from '../../data/word-packs/yle-core/topics/transport.json'
import weather from '../../data/word-packs/yle-core/topics/weather.json'
import type { WordItem } from '../../types/word'

import { getBuiltInVisualToken } from './wordVisualMap'

test('provides built-in visuals for all priority Cambridge topic words', () => {
  const priorityWords = [
    ...(animals as WordItem[]),
    ...(foodAndDrink as WordItem[]),
    ...(school as WordItem[]),
    ...(home as WordItem[]),
    ...(transport as WordItem[]),
    ...(weather as WordItem[]),
    ...(toys as WordItem[]),
    ...(colours as WordItem[]),
  ]

  const missing = priorityWords.filter((word) => !getBuiltInVisualToken(word))
  expect(missing).toEqual([])
})

test('provides a stable visual token for every default Cambridge word', () => {
  const missing = (allWords as WordItem[]).filter((word) => !getBuiltInVisualToken(word))
  expect(missing).toEqual([])
})

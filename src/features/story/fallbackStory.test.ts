import type { WordItem } from '../../types/word'

import { buildFallbackStory } from './fallbackStory'

const words: WordItem[] = [
  {
    id: 'w1',
    word: 'cat',
    normalizedWord: 'cat',
    meaningZh: '猫',
    topic: 'animals',
    tags: ['animals'],
    level: 'preA1',
    source: 'yle-core',
  },
]

test('builds a short local fallback story when AI is not configured', () => {
  const story = buildFallbackStory({ topicId: 'animals', words })

  expect(story.title).toContain('cat')
  expect(story.sentences.length).toBeGreaterThanOrEqual(3)
  expect(story.questions[0].choices).toContain('cat')
})

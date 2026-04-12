import { render, screen } from '@testing-library/react'

import type { WordItem } from '../../types/word'

import { BossReview } from './BossReview'

const words: WordItem[] = [
  {
    id: 'yle-animals-cat',
    word: 'cat',
    normalizedWord: 'cat',
    meaningZh: '猫',
    topic: 'animals',
    tags: ['animal'],
    level: 'preA1',
    source: 'yle-core',
  },
  {
    id: 'yle-school-book',
    word: 'book',
    normalizedWord: 'book',
    meaningZh: '书',
    topic: 'school',
    tags: ['school'],
    level: 'preA1',
    source: 'yle-core',
  },
]

test('boss review mixes new and review words in the final challenge', () => {
  render(<BossReview words={words} />)

  expect(screen.getByText('最终挑战')).toBeInTheDocument()
  expect(screen.getByText('cat')).toBeInTheDocument()
  expect(screen.getByText('book')).toBeInTheDocument()
})

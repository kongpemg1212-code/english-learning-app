import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { WordItem } from '../../types/word'

import { MatchPairs } from './MatchPairs'

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
    id: 'yle-animals-dog',
    word: 'dog',
    normalizedWord: 'dog',
    meaningZh: '狗',
    topic: 'animals',
    tags: ['animal'],
    level: 'preA1',
    source: 'yle-core',
  },
]

test('matches a word with its chinese meaning', async () => {
  const user = userEvent.setup()
  const onAnswer = vi.fn()

  render(<MatchPairs words={words} onAnswer={onAnswer} />)
  await user.click(screen.getByRole('button', { name: 'cat' }))
  await user.click(screen.getByRole('button', { name: '猫' }))

  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})

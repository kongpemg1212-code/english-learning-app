import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { WordItem } from '../../types/word'

import { SpellBlocks } from './SpellBlocks'

const word: WordItem = {
  id: 'yle-animals-cat',
  word: 'cat',
  normalizedWord: 'cat',
  meaningZh: '猫',
  topic: 'animals',
  tags: ['animal'],
  level: 'preA1',
  source: 'yle-core',
}

test('fills the missing letter and submits a correct spelling answer', async () => {
  const user = userEvent.setup()
  const onAnswer = vi.fn()

  render(<SpellBlocks word={word} onAnswer={onAnswer} />)
  await user.click(screen.getByRole('button', { name: 'a' }))

  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})

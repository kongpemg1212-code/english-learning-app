import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { WordItem } from '../../types/word'

import { PictureChoice } from './PictureChoice'

const promptWord: WordItem = {
  id: 'yle-animals-cat',
  word: 'cat',
  normalizedWord: 'cat',
  meaningZh: '猫',
  image: '/cat.png',
  audio: '/cat.mp3',
  example: 'This is a cat.',
  exampleZh: '这是一只猫。',
  topic: 'animals',
  tags: ['animal'],
  level: 'preA1',
  source: 'yle-core',
}

const options: WordItem[] = [
  promptWord,
  {
    id: 'yle-animals-dog',
    word: 'dog',
    normalizedWord: 'dog',
    meaningZh: '狗',
    image: '/dog.png',
    audio: '/dog.mp3',
    topic: 'animals',
    tags: ['animal'],
    level: 'preA1',
    source: 'yle-core',
  },
]

test('submits a correct picture choice', async () => {
  const user = userEvent.setup()
  const onAnswer = vi.fn()

  render(<PictureChoice promptWord={promptWord} options={options} onAnswer={onAnswer} />)
  expect(screen.getByRole('img', { name: 'cat' })).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})

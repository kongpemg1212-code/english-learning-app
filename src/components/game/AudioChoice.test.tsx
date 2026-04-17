import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { WordItem } from '../../types/word'

import { AudioChoice } from './AudioChoice'

const speechMocks = vi.hoisted(() => ({
  speak: vi.fn(),
}))

vi.mock('../../hooks/useSpeech', () => ({
  useSpeech: () => ({
    speak: speechMocks.speak,
  }),
}))

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

test('submits a correct audio choice', async () => {
  const user = userEvent.setup()
  const onAnswer = vi.fn()
  speechMocks.speak.mockReset()

  render(<AudioChoice promptWord={promptWord} options={options} onAnswer={onAnswer} />)
  expect(screen.getByRole('button', { name: '听单词' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '听例句' })).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '听单词' }))
  expect(speechMocks.speak).toHaveBeenCalledWith('cat', {
    audioUrl: '/cat.mp3',
    kind: 'word',
  })
  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})

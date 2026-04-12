import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { WordItem } from '../../types/word'

import { AudioChoice } from './AudioChoice'

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
  const speak = vi.fn()
  function FakeUtterance(this: { text?: string }, text: string) {
    this.text = text
  }
  vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), speak })
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)

  render(<AudioChoice promptWord={promptWord} options={options} onAnswer={onAnswer} />)

  await user.click(screen.getByRole('button', { name: '播放发音' }))
  expect(speak).toHaveBeenCalled()
  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ correct: true }))
})

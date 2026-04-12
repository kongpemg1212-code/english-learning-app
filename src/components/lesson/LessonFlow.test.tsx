import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { DailySession } from '../../types/session'
import type { WordItem } from '../../types/word'

import { LessonFlow } from './LessonFlow'

const words: WordItem[] = [
  {
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
    sortOrder: 1,
  },
]

const session: DailySession = {
  date: '2026-04-12',
  newWords: ['yle-animals-cat'],
  reviewWords: [],
  challengeWords: ['yle-animals-cat'],
  modeSequence: ['picture-choice', 'boss-review'],
  estimatedMinutes: 6,
  status: 'todo',
}

test('renders interactive word discovery before standard practice', async () => {
  const user = userEvent.setup()

  render(<LessonFlow session={session} words={words} onNavigate={() => {}} />)
  expect(screen.getByText('发现新朋友')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '翻开看看' }))

  expect(screen.getByText('cat')).toBeInTheDocument()
  expect(screen.getByText('猫')).toBeInTheDocument()
})

test('progresses from discovery into game modes and the final challenge', async () => {
  const user = userEvent.setup()
  const onNavigate = vi.fn()

  render(<LessonFlow session={session} words={words} onNavigate={onNavigate} />)

  await user.click(screen.getByRole('button', { name: '翻开看看' }))
  await user.click(screen.getByRole('button', { name: '我认识啦' }))

  expect(screen.getByText('找到正确的英文单词')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(screen.getByText('最终挑战')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '完成挑战' }))

  await waitFor(() => {
    expect(onNavigate).toHaveBeenCalledWith('garden')
  }, { timeout: 1500 })
})

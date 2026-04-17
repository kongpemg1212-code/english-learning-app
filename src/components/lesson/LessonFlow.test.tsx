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
    visualKey: 'cat',
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
  {
    id: 'yle-animals-dog',
    word: 'dog',
    normalizedWord: 'dog',
    visualKey: 'dog',
    meaningZh: '狗',
    image: '/dog.png',
    audio: '/dog.mp3',
    example: 'This is a dog.',
    exampleZh: '这是一只狗。',
    topic: 'animals',
    tags: ['animal'],
    level: 'preA1',
    source: 'yle-core',
    sortOrder: 2,
  },
  {
    id: 'yle-school-book',
    word: 'book',
    normalizedWord: 'book',
    visualKey: 'book',
    meaningZh: '书',
    image: '/book.png',
    audio: '/book.mp3',
    example: 'This is a book.',
    exampleZh: '这是一本书。',
    topic: 'school',
    tags: ['school'],
    level: 'preA1',
    source: 'yle-core',
    sortOrder: 3,
  },
]

const session: DailySession = {
  date: '2026-04-12',
  newWords: ['yle-animals-cat'],
  reviewWords: [],
  challengeWords: ['yle-animals-cat'],
  topicId: 'animals',
  modeSequence: ['picture-choice', 'boss-review'],
  estimatedMinutes: 6,
  status: 'todo',
}

test('renders interactive word discovery before standard practice', async () => {
  const user = userEvent.setup()

  render(<LessonFlow session={session} words={words} onNavigate={() => {}} />)
  expect(screen.getByText('发现新朋友')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '翻开闪卡' }))

  expect(screen.getByText('cat')).toBeInTheDocument()
  expect(screen.getByText('猫')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '听一听发音' })).toBeInTheDocument()
})

test('progresses from discovery into game modes and the final challenge', async () => {
  const user = userEvent.setup()
  const onNavigate = vi.fn()

  render(<LessonFlow session={session} words={words} onNavigate={onNavigate} />)

  await user.click(screen.getByRole('button', { name: '翻开闪卡' }))
  await user.click(screen.getByRole('button', { name: '我认识啦' }))

  expect(screen.getByText('找到正确的英文单词')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /dog/i })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /book/i })).not.toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(screen.getByText('最终挑战')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: '完成挑战' }))

  await waitFor(() => {
    expect(onNavigate).toHaveBeenCalledWith('garden')
  }, { timeout: 1500 })
})

test('cycles due review words into later practice steps instead of repeating only new words', async () => {
  const user = userEvent.setup()

  render(
    <LessonFlow
      session={{
        ...session,
        reviewWords: ['yle-animals-dog'],
        modeSequence: ['picture-choice', 'picture-choice', 'boss-review'],
      }}
      words={words}
      onNavigate={() => {}}
    />,
  )

  await user.click(screen.getByRole('button', { name: '翻开闪卡' }))
  await user.click(screen.getByRole('button', { name: '我认识啦' }))
  await user.click(screen.getByRole('button', { name: /cat/i }))

  expect(screen.getByText('狗')).toBeInTheDocument()
})

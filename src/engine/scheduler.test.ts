import type { WordProgress } from '../types/progress'

import { recordAnswer } from './scheduler'

test('promotes a correct answer to the next Leitner stage', () => {
  const result = recordAnswer(
    {
      wordId: 'yle-animals-cat',
      stage: 1,
      seenCount: 1,
      correctCount: 1,
      wrongCount: 0,
      consecutiveCorrect: 1,
      status: 'learning',
    },
    'correct',
    '2026-04-12',
  )

  expect(result.stage).toBe(2)
  expect(result.nextReviewAt).toBe('2026-04-14')
})

test('sends a wrong answer back to learning and same-day recovery', () => {
  const progress: WordProgress = {
    wordId: 'yle-school-book',
    stage: 3,
    seenCount: 4,
    correctCount: 3,
    wrongCount: 1,
    consecutiveCorrect: 2,
    status: 'review',
    lastReviewedAt: '2026-04-10',
    nextReviewAt: '2026-04-16',
  }

  const result = recordAnswer(progress, 'wrong', '2026-04-12')

  expect(result.stage).toBe(1)
  expect(result.status).toBe('learning')
  expect(result.nextReviewAt).toBe('2026-04-12')
  expect(result.consecutiveCorrect).toBe(0)
})

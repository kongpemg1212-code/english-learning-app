import type { WordProgress } from '../types/progress'

import { buildDailySession, pickAdaptiveWords } from './sessionBuilder'

test('builds a daily session with due words first and a varied mode order', () => {
  const session = buildDailySession({
    date: '2026-04-12',
    packId: 'yle-core-v1',
    topicId: 'animals',
    dueWordIds: ['w1', 'w2', 'w3', 'w4', 'w5'],
    newWordIds: ['n1', 'n2', 'n3', 'n4'],
    wrongWordIds: ['w4'],
    modeSeed: 2,
  })

  expect(session.reviewWords).toEqual(['w1', 'w2', 'w3', 'w4', 'w5'])
  expect(session.packId).toBe('yle-core-v1')
  expect(session.topicId).toBe('animals')
  expect(session.newWords.length).toBeLessThanOrEqual(3)
  expect(session.challengeWords).toContain('w4')
  expect(session.modeSequence.length).toBeGreaterThan(0)
  expect(session.estimatedMinutes).toBeGreaterThan(0)
})

test('picks due words before unseen words and skips mastered items', () => {
  const progress: WordProgress[] = [
    {
      wordId: 'w1',
      stage: 1,
      seenCount: 2,
      correctCount: 1,
      wrongCount: 1,
      consecutiveCorrect: 0,
      nextReviewAt: '2026-04-10',
      status: 'learning',
    },
    {
      wordId: 'w2',
      stage: 5,
      seenCount: 6,
      correctCount: 6,
      wrongCount: 0,
      consecutiveCorrect: 4,
      nextReviewAt: '2026-04-30',
      status: 'mastered',
    },
  ]

  const result = pickAdaptiveWords({
    topicWordIds: ['w1', 'w2', 'w3', 'w4'],
    progressRecords: progress,
    date: '2026-04-12',
  })

  expect(result.dueWordIds).toEqual(['w1'])
  expect(result.newWordIds).toEqual(['w3', 'w4'])
  expect(result.wrongWordIds).toEqual(['w1'])
})

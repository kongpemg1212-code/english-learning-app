import { beforeEach, expect, test, vi } from 'vitest'

const sqliteMocks = vi.hoisted(() => ({
  getDailySession: vi.fn(),
  listDailySessions: vi.fn(),
  saveDailySession: vi.fn(),
  clearDailySessions: vi.fn(),
}))

vi.mock('../sqlite/client', () => ({
  getDailySession: sqliteMocks.getDailySession,
  listDailySessions: sqliteMocks.listDailySessions,
  saveDailySession: sqliteMocks.saveDailySession,
  clearDailySessions: sqliteMocks.clearDailySessions,
}))

import { useAppStore } from '../../store/useAppStore'
import { getDailySessionRepo } from './dailySessionRepo'

beforeEach(() => {
  sqliteMocks.getDailySession.mockReset()
  sqliteMocks.listDailySessions.mockReset()
  sqliteMocks.saveDailySession.mockReset()
  sqliteMocks.clearDailySessions.mockReset()
  useAppStore.setState({ cloudProfileId: 'maya' })
})

test('persists and loads daily sessions by date', async () => {
  const repo = getDailySessionRepo()

  await repo.clear()
  expect(sqliteMocks.clearDailySessions).toHaveBeenCalledWith('maya')

  sqliteMocks.getDailySession.mockResolvedValue({
    date: '2026-04-12',
    newWords: ['w1', 'w2', 'w3'],
    reviewWords: ['w4'],
    challengeWords: ['w2', 'w4'],
    modeSequence: ['picture-choice', 'boss-review'],
    estimatedMinutes: 8,
    status: 'todo',
  })

  await repo.save({
    date: '2026-04-12',
    newWords: ['w1', 'w2', 'w3'],
    reviewWords: ['w4'],
    challengeWords: ['w2', 'w4'],
    modeSequence: ['picture-choice', 'boss-review'],
    estimatedMinutes: 8,
    status: 'todo',
  })

  const record = await repo.get('2026-04-12')
  expect(record?.status).toBe('todo')
  expect(sqliteMocks.saveDailySession).toHaveBeenCalledWith(
    'maya',
    expect.objectContaining({ date: '2026-04-12' }),
  )
})

test('lists daily sessions for the active local sqlite profile', async () => {
  const repo = getDailySessionRepo()

  sqliteMocks.listDailySessions.mockResolvedValue([
    {
      date: '2026-04-13',
      newWords: ['w1'],
      reviewWords: ['w2'],
      challengeWords: ['w1', 'w2'],
      modeSequence: ['audio-choice', 'boss-review'],
      estimatedMinutes: 7,
      status: 'done',
    },
  ])

  const sessions = await repo.list()

  expect(sessions).toHaveLength(1)
  expect(sqliteMocks.listDailySessions).toHaveBeenCalledWith('maya')
})

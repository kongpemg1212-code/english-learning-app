import { beforeEach, expect, test, vi } from 'vitest'

const supabaseMocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  getCloudDailySession: vi.fn(),
  listCloudDailySessions: vi.fn(),
  saveCloudDailySession: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({
  getCurrentUser: supabaseMocks.getCurrentUser,
  getCloudDailySession: supabaseMocks.getCloudDailySession,
  listCloudDailySessions: supabaseMocks.listCloudDailySessions,
  saveCloudDailySession: supabaseMocks.saveCloudDailySession,
}))

import { getDailySessionRepo } from './dailySessionRepo'

beforeEach(() => {
  supabaseMocks.getCurrentUser.mockReset()
  supabaseMocks.getCloudDailySession.mockReset()
  supabaseMocks.listCloudDailySessions.mockReset()
  supabaseMocks.saveCloudDailySession.mockReset()
})

test('persists and loads daily sessions by date', async () => {
  const repo = getDailySessionRepo()

  supabaseMocks.getCurrentUser.mockResolvedValue(null)

  await repo.clear()
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
})

test('backfills local daily sessions into the cloud when a cloud profile appears later', async () => {
  const repo = getDailySessionRepo()

  await repo.clear()
  supabaseMocks.getCurrentUser.mockResolvedValue(null)

  await repo.save({
    date: '2026-04-13',
    newWords: ['w1'],
    reviewWords: ['w2'],
    challengeWords: ['w1', 'w2'],
    modeSequence: ['audio-choice', 'boss-review'],
    estimatedMinutes: 7,
    status: 'done',
  })

  supabaseMocks.getCurrentUser.mockResolvedValue({ id: 'cloud-user-2' })
  supabaseMocks.listCloudDailySessions.mockResolvedValue([])

  const sessions = await repo.list()

  expect(sessions).toHaveLength(1)
  expect(supabaseMocks.saveCloudDailySession).toHaveBeenCalledWith(
    { id: 'cloud-user-2' },
    expect.objectContaining({ date: '2026-04-13' }),
  )
})

import { beforeEach, expect, test, vi } from 'vitest'

const supabaseMocks = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  listCloudWordProgress: vi.fn(),
  saveCloudWordProgress: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({
  getCurrentUser: supabaseMocks.getCurrentUser,
  listCloudWordProgress: supabaseMocks.listCloudWordProgress,
  saveCloudWordProgress: supabaseMocks.saveCloudWordProgress,
}))

import { getWordProgressRepo } from './wordProgressRepo'

beforeEach(() => {
  supabaseMocks.getCurrentUser.mockReset()
  supabaseMocks.listCloudWordProgress.mockReset()
  supabaseMocks.saveCloudWordProgress.mockReset()
})

test('persists and loads word progress by word id', async () => {
  const repo = getWordProgressRepo()

  supabaseMocks.getCurrentUser.mockResolvedValue(null)

  await repo.clear()
  await repo.save({
    wordId: 'yle-animals-cat',
    stage: 1,
    seenCount: 1,
    correctCount: 1,
    wrongCount: 0,
    consecutiveCorrect: 1,
    status: 'learning',
  })

  const record = await repo.get('yle-animals-cat')
  expect(record?.stage).toBe(1)
})

test('backfills local word progress into the cloud when a cloud profile appears later', async () => {
  const repo = getWordProgressRepo()

  await repo.clear()
  supabaseMocks.getCurrentUser.mockResolvedValue(null)

  await repo.save({
    wordId: 'yle-animals-dog',
    stage: 2,
    seenCount: 3,
    correctCount: 2,
    wrongCount: 1,
    consecutiveCorrect: 2,
    status: 'review',
  })

  supabaseMocks.getCurrentUser.mockResolvedValue({ id: 'cloud-user-1' })
  supabaseMocks.listCloudWordProgress.mockResolvedValue([])

  const records = await repo.list()

  expect(records).toHaveLength(1)
  expect(supabaseMocks.saveCloudWordProgress).toHaveBeenCalledWith(
    { id: 'cloud-user-1' },
    expect.objectContaining({ wordId: 'yle-animals-dog' }),
  )
})

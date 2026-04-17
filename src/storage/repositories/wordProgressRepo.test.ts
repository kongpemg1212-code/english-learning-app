import { beforeEach, expect, test, vi } from 'vitest'

const supabaseMocks = vi.hoisted(() => ({
  listCloudWordProgress: vi.fn(),
  saveCloudWordProgress: vi.fn(),
}))

vi.mock('../../lib/supabase', () => ({
  listCloudWordProgress: supabaseMocks.listCloudWordProgress,
  saveCloudWordProgress: supabaseMocks.saveCloudWordProgress,
}))

import { useAppStore } from '../../store/useAppStore'
import { getWordProgressRepo } from './wordProgressRepo'

beforeEach(() => {
  supabaseMocks.listCloudWordProgress.mockReset()
  supabaseMocks.saveCloudWordProgress.mockReset()
  useAppStore.setState({ cloudProfileId: undefined })
})

test('persists and loads word progress by word id', async () => {
  const repo = getWordProgressRepo()

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

  await repo.save({
    wordId: 'yle-animals-dog',
    stage: 2,
    seenCount: 3,
    correctCount: 2,
    wrongCount: 1,
    consecutiveCorrect: 2,
    status: 'review',
  })

  useAppStore.setState({ cloudProfileId: 'cloud-user-1' })
  supabaseMocks.listCloudWordProgress.mockResolvedValue([])

  const records = await repo.list()

  expect(records).toHaveLength(1)
  expect(supabaseMocks.saveCloudWordProgress).toHaveBeenCalledWith(
    'cloud-user-1',
    expect.objectContaining({ wordId: 'yle-animals-dog' }),
  )
})

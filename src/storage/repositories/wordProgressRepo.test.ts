import { beforeEach, expect, test, vi } from 'vitest'

const sqliteMocks = vi.hoisted(() => ({
  getWordProgress: vi.fn(),
  listWordProgress: vi.fn(),
  saveWordProgress: vi.fn(),
  clearWordProgress: vi.fn(),
}))

vi.mock('../sqlite/client', () => ({
  getWordProgress: sqliteMocks.getWordProgress,
  listWordProgress: sqliteMocks.listWordProgress,
  saveWordProgress: sqliteMocks.saveWordProgress,
  clearWordProgress: sqliteMocks.clearWordProgress,
}))

import { useAppStore } from '../../store/useAppStore'
import { getWordProgressRepo } from './wordProgressRepo'

beforeEach(() => {
  sqliteMocks.getWordProgress.mockReset()
  sqliteMocks.listWordProgress.mockReset()
  sqliteMocks.saveWordProgress.mockReset()
  sqliteMocks.clearWordProgress.mockReset()
  useAppStore.setState({ cloudProfileId: 'maya' })
})

test('persists and loads word progress by word id', async () => {
  const repo = getWordProgressRepo()

  await repo.clear()
  expect(sqliteMocks.clearWordProgress).toHaveBeenCalledWith('maya')

  sqliteMocks.getWordProgress.mockResolvedValue({
    wordId: 'yle-animals-cat',
    stage: 1,
    seenCount: 1,
    correctCount: 1,
    wrongCount: 0,
    consecutiveCorrect: 1,
    status: 'learning',
  })

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
  expect(sqliteMocks.saveWordProgress).toHaveBeenCalledWith(
    'maya',
    expect.objectContaining({ wordId: 'yle-animals-cat' }),
  )
})

test('lists word progress for the active local sqlite profile', async () => {
  const repo = getWordProgressRepo()

  sqliteMocks.listWordProgress.mockResolvedValue([
    {
      wordId: 'yle-animals-dog',
      stage: 2,
      seenCount: 3,
    correctCount: 2,
      wrongCount: 1,
      consecutiveCorrect: 2,
      status: 'review',
    },
  ])

  const records = await repo.list()

  expect(records).toHaveLength(1)
  expect(sqliteMocks.listWordProgress).toHaveBeenCalledWith('maya')
})

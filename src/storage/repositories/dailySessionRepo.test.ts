import { getDailySessionRepo } from './dailySessionRepo'

test('persists and loads daily sessions by date', async () => {
  const repo = getDailySessionRepo()

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

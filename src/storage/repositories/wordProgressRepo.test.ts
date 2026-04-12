import { getWordProgressRepo } from './wordProgressRepo'

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

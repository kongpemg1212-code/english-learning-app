import type { WordProgress } from '../../types/progress'
import { createObjectStoreRepository } from '../db'

const wordProgressRepo = createObjectStoreRepository<WordProgress>({
  dbName: 'word-garden-db',
  storeName: 'word-progress',
  version: 1,
  keyField: 'wordId',
})

export function getWordProgressRepo() {
  return wordProgressRepo
}

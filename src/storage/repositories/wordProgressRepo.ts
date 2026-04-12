import type { WordProgress } from '../../types/progress'
import { getCurrentUser, listCloudWordProgress, saveCloudWordProgress } from '../../lib/supabase'
import { createObjectStoreRepository } from '../db'

const localWordProgressRepo = createObjectStoreRepository<WordProgress>({
  dbName: 'word-garden-db',
  storeName: 'word-progress',
  version: 1,
  keyField: 'wordId',
})

export function getWordProgressRepo() {
  return {
    async get(key: string) {
      const user = await getCurrentUser()
      if (user) {
        const records = await listCloudWordProgress(user)
        return records.find((record) => record.wordId === key)
      }

      return localWordProgressRepo.get(key)
    },
    async save(value: WordProgress) {
      await localWordProgressRepo.save(value)
      const user = await getCurrentUser()
      if (user) {
        await saveCloudWordProgress(user, value)
      }
    },
    async clear() {
      await localWordProgressRepo.clear()
    },
    async list() {
      const user = await getCurrentUser()
      if (user) {
        return listCloudWordProgress(user)
      }

      return localWordProgressRepo.list()
    },
  }
}

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
        try {
          const records = await listCloudWordProgress(user)
          const found = records.find((record) => record.wordId === key)
          if (found) {
            return found
          }
        } catch {
          return localWordProgressRepo.get(key)
        }
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
        try {
          const records = await listCloudWordProgress(user)
          return records.length > 0 ? records : localWordProgressRepo.list()
        } catch {
          return localWordProgressRepo.list()
        }
      }

      return localWordProgressRepo.list()
    },
  }
}

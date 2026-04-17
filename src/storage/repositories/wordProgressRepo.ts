import type { WordProgress } from '../../types/progress'
import { listCloudWordProgress, saveCloudWordProgress } from '../../lib/supabase'
import { useAppStore } from '../../store/useAppStore'
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
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        try {
          const records = await listCloudWordProgress(profileId)
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
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        await saveCloudWordProgress(profileId, value)
      }
    },
    async clear() {
      await localWordProgressRepo.clear()
    },
    async list() {
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        try {
          const records = await listCloudWordProgress(profileId)
          if (records.length > 0) {
            return records
          }

          const localRecords = await localWordProgressRepo.list()
          if (localRecords.length > 0) {
            await Promise.all(localRecords.map((record) => saveCloudWordProgress(profileId, record)))
          }

          return localRecords
        } catch {
          return localWordProgressRepo.list()
        }
      }

      return localWordProgressRepo.list()
    },
  }
}

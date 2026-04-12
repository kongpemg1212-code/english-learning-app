import type { DailySession } from '../../types/session'
import { getCloudDailySession, getCurrentUser, listCloudDailySessions, saveCloudDailySession } from '../../lib/supabase'
import { createObjectStoreRepository } from '../db'

const localDailySessionRepo = createObjectStoreRepository<DailySession>({
  dbName: 'word-garden-db',
  storeName: 'daily-sessions',
  version: 1,
  keyField: 'date',
})

export function getDailySessionRepo() {
  return {
    async get(key: string) {
      const user = await getCurrentUser()
      if (user) {
        return getCloudDailySession(user, key)
      }

      return localDailySessionRepo.get(key)
    },
    async save(value: DailySession) {
      await localDailySessionRepo.save(value)
      const user = await getCurrentUser()
      if (user) {
        await saveCloudDailySession(user, value)
      }
    },
    async clear() {
      await localDailySessionRepo.clear()
    },
    async list() {
      const user = await getCurrentUser()
      if (user) {
        return listCloudDailySessions(user)
      }

      return localDailySessionRepo.list()
    },
  }
}

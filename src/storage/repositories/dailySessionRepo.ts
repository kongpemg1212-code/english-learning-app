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
        try {
          return (await getCloudDailySession(user, key)) ?? localDailySessionRepo.get(key)
        } catch {
          return localDailySessionRepo.get(key)
        }
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
        try {
          const sessions = await listCloudDailySessions(user)
          if (sessions.length > 0) {
            return sessions
          }

          const localSessions = await localDailySessionRepo.list()
          if (localSessions.length > 0) {
            await Promise.all(localSessions.map((session) => saveCloudDailySession(user, session)))
          }

          return localSessions
        } catch {
          return localDailySessionRepo.list()
        }
      }

      return localDailySessionRepo.list()
    },
  }
}

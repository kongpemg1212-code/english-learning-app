import type { DailySession } from '../../types/session'
import { getCloudDailySession, listCloudDailySessions, saveCloudDailySession } from '../../lib/supabase'
import { useAppStore } from '../../store/useAppStore'
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
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        try {
          return (await getCloudDailySession(profileId, key)) ?? localDailySessionRepo.get(key)
        } catch {
          return localDailySessionRepo.get(key)
        }
      }

      return localDailySessionRepo.get(key)
    },
    async save(value: DailySession) {
      await localDailySessionRepo.save(value)
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        await saveCloudDailySession(profileId, value)
      }
    },
    async clear() {
      await localDailySessionRepo.clear()
    },
    async list() {
      const profileId = useAppStore.getState().cloudProfileId
      if (profileId) {
        try {
          const sessions = await listCloudDailySessions(profileId)
          if (sessions.length > 0) {
            return sessions
          }

          const localSessions = await localDailySessionRepo.list()
          if (localSessions.length > 0) {
            await Promise.all(localSessions.map((session) => saveCloudDailySession(profileId, session)))
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

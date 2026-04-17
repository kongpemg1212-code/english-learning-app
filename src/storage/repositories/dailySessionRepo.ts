import type { DailySession } from '../../types/session'
import { useAppStore } from '../../store/useAppStore'
import {
  clearDailySessions,
  getDailySession,
  listDailySessions,
  saveDailySession,
} from '../sqlite/client'

export function getDailySessionRepo() {
  return {
    async get(key: string) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return undefined
      }

      return getDailySession(profileId, key)
    },
    async save(value: DailySession) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await saveDailySession(profileId, value)
    },
    async clear() {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await clearDailySessions(profileId)
    },
    async list() {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return []
      }

      return listDailySessions(profileId)
    },
  }
}

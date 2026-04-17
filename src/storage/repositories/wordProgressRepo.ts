import type { WordProgress } from '../../types/progress'
import { useAppStore } from '../../store/useAppStore'
import {
  clearWordProgress,
  getWordProgress,
  listWordProgress,
  saveWordProgress,
} from '../sqlite/client'

export function getWordProgressRepo() {
  return {
    async get(key: string) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return undefined
      }

      return getWordProgress(profileId, key)
    },
    async save(value: WordProgress) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await saveWordProgress(profileId, value)
    },
    async clear() {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await clearWordProgress(profileId)
    },
    async list() {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return []
      }

      return listWordProgress(profileId)
    },
  }
}

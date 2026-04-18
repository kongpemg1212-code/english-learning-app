import { useAppStore } from '../../store/useAppStore'
import type { StoryChatMessage, StoryPayload } from '../../types/story'
import {
  getCachedStory,
  listStoryChatMessages,
  saveCachedStory,
  saveStoryChatMessage,
} from '../sqlite/client'

export function getStoryRepo() {
  return {
    async get(date: string, topicId: string) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return undefined
      }

      return getCachedStory(profileId, date, topicId)
    },
    async save(date: string, topicId: string, story: StoryPayload) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await saveCachedStory(profileId, date, topicId, story)
    },
    async listChat(date: string, topicId: string) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return []
      }

      return listStoryChatMessages(profileId, date, topicId)
    },
    async saveChat(date: string, topicId: string, message: StoryChatMessage) {
      const profileId = useAppStore.getState().cloudProfileId
      if (!profileId) {
        return
      }

      await saveStoryChatMessage(profileId, date, topicId, message)
    },
  }
}

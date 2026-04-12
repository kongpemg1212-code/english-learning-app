import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'

import type { GardenPlant } from '../features/garden/rules'
import type { WordPack } from '../types/word'

type TopicId = string

type AppState = {
  totalStars: number
  currentStreak: number
  lastCompletedDate?: string
  gardenStage: number
  selectedPlant: GardenPlant
  selectedTopicId: TopicId
  selectedPackId?: string
  importedPacks: WordPack[]
  soundEnabled: boolean
  completeMission: (date: string, earnedStars: number) => void
  choosePlant: (plant: GardenPlant) => void
  chooseTopic: (topicId: TopicId) => void
  addImportedPack: (pack: WordPack) => void
  selectPack: (packId?: string) => void
  toggleSound: () => void
}

const memoryStorage = new Map<string, string>()

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return memoryStorage.get(name) ?? null
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value)
      return
    } catch {
      memoryStorage.set(name, value)
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
      return
    } catch {
      memoryStorage.delete(name)
    }
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      totalStars: 0,
      currentStreak: 0,
      lastCompletedDate: undefined,
      gardenStage: 0,
      selectedPlant: 'sunflower',
      selectedTopicId: 'school',
      selectedPackId: undefined,
      importedPacks: [],
      soundEnabled: true,
      completeMission: (date, earnedStars) => {
        const previousDate = get().lastCompletedDate
        if (previousDate === date) {
          return
        }

        const nextStreak = get().currentStreak + 1

        set((state) => ({
          totalStars: state.totalStars + earnedStars,
          currentStreak: nextStreak,
          lastCompletedDate: date,
          gardenStage: Math.min(state.gardenStage + 1, 4),
        }))
      },
      choosePlant: (plant) => set({ selectedPlant: plant }),
      chooseTopic: (topicId) => set({ selectedTopicId: topicId }),
      addImportedPack: (pack) =>
        set((state) => ({
          importedPacks: [
            ...state.importedPacks.filter((item) => item.meta.id !== pack.meta.id),
            pack,
          ],
          selectedPackId: pack.meta.id,
          selectedTopicId: pack.topics[0]?.id ?? state.selectedTopicId,
        })),
      selectPack: (packId) =>
        set((state) => {
          const selectedPack = state.importedPacks.find((pack) => pack.meta.id === packId)
          return {
            selectedPackId: packId,
            selectedTopicId: selectedPack?.topics[0]?.id ?? 'school',
          }
        }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    }),
    {
      name: 'word-garden-ui-store',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)

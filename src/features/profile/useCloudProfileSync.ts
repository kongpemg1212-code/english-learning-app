import { useEffect, useMemo, useRef, useState } from 'react'

import {
  getCloudAppState,
  hasSupabaseConfig,
  saveCloudAppState,
} from '../../lib/supabase'
import { getDailySessionRepo } from '../../storage/repositories/dailySessionRepo'
import { getWordProgressRepo } from '../../storage/repositories/wordProgressRepo'
import { createDefaultCloudAppState, useAppStore } from '../../store/useAppStore'

import { DEFAULT_PROFILE_ID, generateProfileId } from './profileId'

async function clearLocalLearningData() {
  await Promise.all([getWordProgressRepo().clear(), getDailySessionRepo().clear()])
}

export function useCloudProfileSync() {
  const cloudProfileId = useAppStore((state) => state.cloudProfileId)
  const setCloudProfileId = useAppStore((state) => state.setCloudProfileId)
  const applyCloudAppState = useAppStore((state) => state.applyCloudAppState)
  const totalStars = useAppStore((state) => state.totalStars)
  const currentStreak = useAppStore((state) => state.currentStreak)
  const lastCompletedDate = useAppStore((state) => state.lastCompletedDate)
  const gardenStage = useAppStore((state) => state.gardenStage)
  const selectedPlant = useAppStore((state) => state.selectedPlant)
  const selectedTopicId = useAppStore((state) => state.selectedTopicId)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const soundEnabled = useAppStore((state) => state.soundEnabled)

  const snapshot = useMemo(
    () => ({
      totalStars,
      currentStreak,
      lastCompletedDate,
      gardenStage,
      selectedPlant,
      selectedTopicId,
      selectedPackId,
      importedPacks,
      soundEnabled,
    }),
    [
      currentStreak,
      gardenStage,
      importedPacks,
      lastCompletedDate,
      selectedPackId,
      selectedPlant,
      selectedTopicId,
      soundEnabled,
      totalStars,
    ],
  )

  const [hydratedProfileId, setHydratedProfileId] = useState<string | null>(null)
  const previousProfileIdRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (!cloudProfileId) {
      setCloudProfileId(generateProfileId())
      return
    }

    if (/^kid-/i.test(cloudProfileId)) {
      setCloudProfileId(DEFAULT_PROFILE_ID)
    }
  }, [cloudProfileId, setCloudProfileId])

  useEffect(() => {
    if (!cloudProfileId) {
      return
    }

    const nextProfileId = cloudProfileId
    let active = true

    async function hydrateProfile() {
      const previousProfileId = previousProfileIdRef.current
      if (previousProfileId && previousProfileId !== nextProfileId) {
        await clearLocalLearningData()
        useAppStore.setState((state) => ({
          ...state,
          ...createDefaultCloudAppState(),
          cloudProfileId: nextProfileId,
        }))
      }

      if (!hasSupabaseConfig) {
        if (active) {
          previousProfileIdRef.current = nextProfileId
          setHydratedProfileId(nextProfileId)
        }
        return
      }

      try {
        const cloudSnapshot = await getCloudAppState(nextProfileId)
        if (active && cloudSnapshot) {
          applyCloudAppState(cloudSnapshot)
        }
      } finally {
        if (active) {
          previousProfileIdRef.current = nextProfileId
          setHydratedProfileId(nextProfileId)
        }
      }
    }

    void hydrateProfile()

    return () => {
      active = false
    }
  }, [applyCloudAppState, cloudProfileId])

  useEffect(() => {
    if (!hasSupabaseConfig || !cloudProfileId || hydratedProfileId !== cloudProfileId) {
      return
    }

    const timer = window.setTimeout(() => {
      void saveCloudAppState(cloudProfileId, snapshot).catch(() => undefined)
    }, 180)

    return () => {
      window.clearTimeout(timer)
    }
  }, [cloudProfileId, hydratedProfileId, snapshot])

  return useMemo(
    () => ({
      profileId: cloudProfileId ?? '',
      cloudEnabled: hasSupabaseConfig,
      synced: hasSupabaseConfig && hydratedProfileId === cloudProfileId,
    }),
    [cloudProfileId, hydratedProfileId],
  )
}

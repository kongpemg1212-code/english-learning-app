import { useEffect, useMemo, useRef, useState } from 'react'

import { createDefaultCloudAppState, useAppStore } from '../../store/useAppStore'
import { loadProfileState, saveProfileState } from '../../storage/sqlite/client'

import { DEFAULT_PROFILE_ID } from './profileId'

export function useLocalProfileSync() {
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
      try {
        const localSnapshot = await loadProfileState(nextProfileId)
        if (active) {
          applyCloudAppState(localSnapshot ?? createDefaultCloudAppState())
        }
      } finally {
        if (active) {
          previousProfileIdRef.current = nextProfileId
          setHydratedProfileId(nextProfileId)
        }
      }
    }

    if (previousProfileIdRef.current && previousProfileIdRef.current !== nextProfileId) {
      applyCloudAppState(createDefaultCloudAppState())
    }

    void hydrateProfile()

    return () => {
      active = false
    }
  }, [applyCloudAppState, cloudProfileId])

  useEffect(() => {
    if (!cloudProfileId || hydratedProfileId !== cloudProfileId) {
      return
    }

    const timer = window.setTimeout(() => {
      void saveProfileState(cloudProfileId, snapshot).catch(() => undefined)
    }, 180)

    return () => {
      window.clearTimeout(timer)
    }
  }, [cloudProfileId, hydratedProfileId, snapshot])

  return useMemo(
    () => ({
      profileId: cloudProfileId ?? '',
      synced: hydratedProfileId === cloudProfileId,
    }),
    [cloudProfileId, hydratedProfileId],
  )
}

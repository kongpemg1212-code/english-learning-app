import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { CloudAppState } from '../store/useAppStore'
import type { WordPack } from '../types/word'
import type { DailySession } from '../types/session'
import type { WordProgress } from '../types/progress'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export async function getCurrentUser() {
  return null
}

type LearningCloudData = {
  wordProgress?: Record<string, WordProgress>
  dailySessions?: Record<string, DailySession>
  importedPacks?: WordPack[]
  selectedPackId?: string
  appState?: CloudAppState
}

type LearningProfileRow = {
  profile_id: string
  payload: LearningCloudData
}

async function getProfileRow(profileId: string): Promise<LearningProfileRow | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from('learning_profiles')
    .select('profile_id,payload')
    .eq('profile_id', profileId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as LearningProfileRow | null) ?? null
}

async function updateLearningCloudData(
  profileId: string,
  updater: (current: LearningCloudData) => LearningCloudData,
) {
  if (!supabase) {
    return
  }

  const current = (await getProfileRow(profileId))?.payload ?? {}
  const next = updater(current)

  const { error } = await supabase.from('learning_profiles').upsert(
    {
      profile_id: profileId,
      payload: next,
    },
    { onConflict: 'profile_id' },
  )

  if (error) {
    throw error
  }
}

export async function getCloudAppState(profileId: string): Promise<CloudAppState | null> {
  const payload = (await getProfileRow(profileId))?.payload
  return payload?.appState ?? null
}

export async function saveCloudAppState(profileId: string, value: CloudAppState) {
  await updateLearningCloudData(profileId, (current) => ({
    ...current,
    importedPacks: value.importedPacks,
    selectedPackId: value.selectedPackId,
    appState: value,
  }))
}

export async function listCloudWordProgress(profileId: string): Promise<WordProgress[]> {
  return Object.values(((await getProfileRow(profileId))?.payload.wordProgress ?? {}))
}

export async function saveCloudWordProgress(profileId: string, value: WordProgress) {
  await updateLearningCloudData(profileId, (current) => ({
    ...current,
    wordProgress: {
      ...(current.wordProgress ?? {}),
      [value.wordId]: value,
    },
  }))
}

export async function listCloudDailySessions(profileId: string): Promise<DailySession[]> {
  return Object.values(((await getProfileRow(profileId))?.payload.dailySessions ?? {}))
}

export async function getCloudDailySession(profileId: string, date: string) {
  const sessions = await listCloudDailySessions(profileId)
  return sessions.find((item) => item.date === date)
}

export async function saveCloudDailySession(profileId: string, value: DailySession) {
  await updateLearningCloudData(profileId, (current) => ({
    ...current,
    dailySessions: {
      ...(current.dailySessions ?? {}),
      [value.date]: value,
    },
  }))
}

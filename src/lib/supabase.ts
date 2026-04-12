import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js'

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
  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getUser()
  return data.user ?? null
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export async function ensureCloudSession() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const existingSession = await getCurrentSession()
  if (existingSession) {
    return existingSession
  }

  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        learning_app: {},
      },
    },
  })

  if (error) {
    throw error
  }

  return data.session ?? null
}

export async function signOut() {
  if (!supabase) {
    return
  }

  await supabase.auth.signOut()
}

type LearningCloudData = {
  wordProgress?: Record<string, WordProgress>
  dailySessions?: Record<string, DailySession>
  importedPacks?: WordPack[]
  selectedPackId?: string
}

async function getFreshUser(user: User) {
  if (!supabase) {
    return user
  }

  const { data } = await supabase.auth.getUser()
  return data.user ?? user
}

function getLearningCloudData(user: User): LearningCloudData {
  const raw = user.user_metadata?.learning_app
  return raw && typeof raw === 'object' ? (raw as LearningCloudData) : {}
}

async function updateLearningCloudData(
  user: User,
  updater: (current: LearningCloudData) => LearningCloudData,
) {
  if (!supabase) {
    return
  }

  const freshUser = await getFreshUser(user)
  const current = getLearningCloudData(freshUser)
  const next = updater(current)

  const { error } = await supabase.auth.updateUser({
    data: {
      ...freshUser.user_metadata,
      learning_app: next,
    },
  })

  if (error) {
    throw error
  }
}

export async function listCloudWordProgress(user: User): Promise<WordProgress[]> {
  const freshUser = await getFreshUser(user)
  return Object.values(getLearningCloudData(freshUser).wordProgress ?? {})
}

export async function saveCloudWordProgress(user: User, value: WordProgress) {
  await updateLearningCloudData(user, (current) => ({
    ...current,
    wordProgress: {
      ...(current.wordProgress ?? {}),
      [value.wordId]: value,
    },
  }))
}

export async function listCloudDailySessions(user: User): Promise<DailySession[]> {
  const freshUser = await getFreshUser(user)
  return Object.values(getLearningCloudData(freshUser).dailySessions ?? {})
}

export async function getCloudDailySession(user: User, date: string) {
  const sessions = await listCloudDailySessions(user)
  return sessions.find((item) => item.date === date)
}

export async function saveCloudDailySession(user: User, value: DailySession) {
  await updateLearningCloudData(user, (current) => ({
    ...current,
    dailySessions: {
      ...(current.dailySessions ?? {}),
      [value.date]: value,
    },
  }))
}

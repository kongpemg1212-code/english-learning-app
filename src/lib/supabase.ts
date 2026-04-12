import { createClient, type Session, type SupabaseClient, type User } from '@supabase/supabase-js'

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

export async function sendMagicLink(email: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }

  const redirectTo =
    import.meta.env.VITE_PUBLIC_APP_URL ||
    `${window.location.origin}${window.location.pathname}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  if (!supabase) {
    return
  }

  await supabase.auth.signOut()
}

export async function listCloudWordProgress(user: User): Promise<WordProgress[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('word_progress')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return (data ?? []) as WordProgress[]
}

export async function saveCloudWordProgress(user: User, value: WordProgress) {
  if (!supabase) {
    return
  }

  const { error } = await supabase.from('word_progress').upsert({
    user_id: user.id,
    word_id: value.wordId,
    stage: value.stage,
    seen_count: value.seenCount,
    correct_count: value.correctCount,
    wrong_count: value.wrongCount,
    consecutive_correct: value.consecutiveCorrect,
    last_reviewed_at: value.lastReviewedAt,
    next_review_at: value.nextReviewAt,
    status: value.status,
  })

  if (error) {
    throw error
  }
}

export async function listCloudDailySessions(user: User): Promise<DailySession[]> {
  if (!supabase) {
    return []
  }

  const { data, error } = await supabase
    .from('daily_sessions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return (data ?? []).map((row: Record<string, unknown>) => ({
    date: String(row.date ?? ''),
    packId: row.pack_id ? String(row.pack_id) : undefined,
    topicId: row.topic_id ? String(row.topic_id) : undefined,
    newWords: Array.isArray(row.new_words) ? (row.new_words as string[]) : [],
    reviewWords: Array.isArray(row.review_words) ? (row.review_words as string[]) : [],
    challengeWords: Array.isArray(row.challenge_words) ? (row.challenge_words as string[]) : [],
    modeSequence: Array.isArray(row.mode_sequence) ? (row.mode_sequence as DailySession['modeSequence']) : [],
    estimatedMinutes: Number(row.estimated_minutes ?? 0),
    status: row.status === 'done' ? 'done' : 'todo',
  }))
}

export async function getCloudDailySession(user: User, date: string) {
  const sessions = await listCloudDailySessions(user)
  return sessions.find((item) => item.date === date)
}

export async function saveCloudDailySession(user: User, value: DailySession) {
  if (!supabase) {
    return
  }

  const { error } = await supabase.from('daily_sessions').upsert({
    user_id: user.id,
    date: value.date,
    pack_id: value.packId,
    topic_id: value.topicId,
    new_words: value.newWords,
    review_words: value.reviewWords,
    challenge_words: value.challengeWords,
    mode_sequence: value.modeSequence,
    estimated_minutes: value.estimatedMinutes,
    status: value.status,
  })

  if (error) {
    throw error
  }
}

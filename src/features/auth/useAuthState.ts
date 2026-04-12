import { useEffect, useState } from 'react'

import type { Session } from '@supabase/supabase-js'

import { ensureCloudSession, getCurrentSession, hasSupabaseConfig, signOut, supabase } from '../../lib/supabase'

export function useAuthState() {
  const [loading, setLoading] = useState(hasSupabaseConfig)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      return
    }

    let active = true

    void getCurrentSession().then((nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (active) {
        setSession(nextSession)
        setLoading(false)
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    loading,
    session,
    user: session?.user ?? null,
    available: hasSupabaseConfig,
    ensureSession: ensureCloudSession,
    signOut,
  }
}

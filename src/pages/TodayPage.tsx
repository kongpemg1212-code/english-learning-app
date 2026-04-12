import { useEffect, useMemo, useState } from 'react'

import { LessonFlow } from '../components/lesson/LessonFlow'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { getActiveWordPack } from '../data/word-packs/activePack'
import { buildDailySession, pickAdaptiveWords } from '../engine/sessionBuilder'
import { getDailySessionRepo } from '../storage/repositories/dailySessionRepo'
import { getWordProgressRepo } from '../storage/repositories/wordProgressRepo'
import { useAppStore } from '../store/useAppStore'
import type { WordProgress } from '../types/progress'
import { toDateKey } from '../utils/date'
import type { DailySession } from '../types/session'

type TodayPageProps = {
  onNavigate: (route: 'today' | 'map' | 'garden' | 'progress' | 'parent') => void
}

export function TodayPage({ onNavigate }: TodayPageProps) {
  const [started, setStarted] = useState(false)
  const [session, setSession] = useState<DailySession | null>(null)
  const selectedTopicId = useAppStore((state) => state.selectedTopicId)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const activePack = useMemo(
    () => getActiveWordPack(importedPacks, selectedPackId),
    [importedPacks, selectedPackId],
  )
  const dateKey = toDateKey(new Date())

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      const topicWordIds = activePack.words
        .filter((word) => word.topic === selectedTopicId)
        .slice(0, activePack.words.length > 0 ? activePack.words.length : 0)
        .map((word) => word.id)
      const safeTopicWordIds =
        topicWordIds.length > 0
          ? topicWordIds
          : activePack.words.slice(0, 3).map((word) => word.id)

      let progressRecords: WordProgress[] = []
      let existing: DailySession | undefined

      try {
        const dailyRepo = getDailySessionRepo()
        const progressRepo = getWordProgressRepo()
        existing = await dailyRepo.get(dateKey)
        progressRecords = await progressRepo.list()
      } catch {
        progressRecords = []
      }

      if (
        existing &&
        existing.packId === activePack.meta.id &&
        existing.topicId === selectedTopicId
      ) {
        if (!cancelled) {
          setSession(existing)
        }
        return
      }

      const adaptive = pickAdaptiveWords({
        topicWordIds: safeTopicWordIds,
        progressRecords,
        date: dateKey,
      })

      const nextSession = buildDailySession({
        date: dateKey,
        packId: activePack.meta.id,
        topicId: selectedTopicId,
        dueWordIds: adaptive.dueWordIds,
        newWordIds: adaptive.newWordIds,
        wrongWordIds: adaptive.wrongWordIds,
        modeSeed: 1,
      })

      if (!cancelled) {
        setSession(nextSession)
      }

      void getDailySessionRepo()
        .save(nextSession)
        .catch(() => undefined)
    }

    void loadSession()

    return () => {
      cancelled = true
    }
  }, [activePack.meta.id, activePack.words, dateKey, selectedTopicId])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      {started ? (
        session ? <LessonFlow session={session} words={activePack.words} onNavigate={onNavigate} /> : null
      ) : (
        <Card
          style={{
            width: '100%',
            maxWidth: '560px',
            display: 'grid',
            gap: '20px',
            textAlign: 'center',
            padding: '32px',
          }}
        >
          <p style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-light)' }}>
            今日任务 · {activePack.meta.name}
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              lineHeight: 1.02,
            }}
          >
            一起开始今天的英语冒险
          </h1>
          <p style={{ margin: 0, fontSize: '1.05rem', color: 'var(--color-text-light)' }}>
            {session
              ? `${session.newWords.length} 个新词，${session.reviewWords.length} 个复习词，还有一个小惊喜在等你。`
              : '正在整理今天最适合你的单词任务…'}
          </p>
          <Button onClick={() => setStarted(true)} disabled={!session}>
            开始今天的冒险
          </Button>
        </Card>
      )}
    </main>
  )
}

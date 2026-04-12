import { useEffect, useState } from 'react'

import { getActiveWordPack } from '../data/word-packs/activePack'
import { ErrorWordsList } from '../components/progress/ErrorWordsList'
import { ProgressSummary } from '../components/progress/ProgressSummary'
import { StarsPanel } from '../components/reward/StarsPanel'
import { StreakPanel } from '../components/reward/StreakPanel'
import { Card } from '../components/ui/Card'
import { getDailySessionRepo } from '../storage/repositories/dailySessionRepo'
import { getWordProgressRepo } from '../storage/repositories/wordProgressRepo'
import { useAppStore } from '../store/useAppStore'
import type { WordProgress } from '../types/progress'
import type { DailySession } from '../types/session'

export function ProgressPage() {
  const totalStars = useAppStore((state) => state.totalStars)
  const currentStreak = useAppStore((state) => state.currentStreak)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const activePack = getActiveWordPack(importedPacks, selectedPackId)
  const [progress, setProgress] = useState<WordProgress[]>([])
  const [history, setHistory] = useState<DailySession[]>([])

  useEffect(() => {
    const repo = getWordProgressRepo()
    void repo.list().then(setProgress)
    void getDailySessionRepo().list().then((items) => {
      setHistory(items.sort((left, right) => right.date.localeCompare(left.date)).slice(0, 5))
    })
  }, [])

  const learnedCount = progress.filter((item) => item.correctCount > 0).length
  const masteredCount = progress.filter((item) => item.status === 'mastered').length
  const errorWords = progress
    .filter((item) => item.wrongCount > 0)
    .map((item) => activePack.words.find((word) => word.id === item.wordId)?.word ?? item.wordId)

  return (
    <main style={{ padding: '20px 0', display: 'grid', gap: '16px' }}>
      <Card style={{ display: 'grid', gap: '16px' }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: '8px' }}>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>我的进度</p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>一点点坚持，也会开花</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
          <StarsPanel value={totalStars} />
          <StreakPanel value={currentStreak} />
        </div>
        <ProgressSummary learnedCount={learnedCount} totalCount={activePack.words.length} />
        <div style={{ color: 'var(--color-text-light)' }}>已掌握：{masteredCount} 个词</div>
        <ErrorWordsList words={errorWords} />
        <section style={{ display: 'grid', gap: '10px' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>最近学习记录</h2>
          {history.length === 0 ? (
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>还没有历史记录。</p>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {history.map((item) => (
                <div
                  key={item.date}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,255,255,0.72)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  {item.date} · 新词 {item.newWords.length} · 复习 {item.reviewWords.length} · {item.status === 'done' ? '已完成' : '未完成'}
                </div>
              ))}
            </div>
          )}
        </section>
      </Card>
    </main>
  )
}

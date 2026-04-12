import { useState } from 'react'

import { AnswerFeedback } from '../components/feedback/AnswerFeedback'
import { GardenGrowth } from '../components/reward/GardenGrowth'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import {
  getPlantUnlockText,
  isPlantUnlocked,
  STRAWBERRY_UNLOCK_STARS,
  TULIP_UNLOCK_STREAK,
  type GardenPlant,
} from '../features/garden/rules'
import { useAppStore } from '../store/useAppStore'

type GardenPageProps = {
  onNavigate: (route: 'today' | 'map' | 'garden' | 'progress' | 'parent') => void
}

export function GardenPage({ onNavigate }: GardenPageProps) {
  const totalStars = useAppStore((state) => state.totalStars)
  const currentStreak = useAppStore((state) => state.currentStreak)
  const gardenStage = useAppStore((state) => state.gardenStage)
  const selectedPlant = useAppStore((state) => state.selectedPlant)
  const choosePlant = useAppStore((state) => state.choosePlant)
  const [feedback, setFeedback] = useState<string | null>(null)
  const stats = { totalStars, currentStreak }

  function handleChoosePlant(plant: GardenPlant, label: string) {
    if (!isPlantUnlocked(plant, stats)) {
      setFeedback(`${label}还没解锁`)
      return
    }

    if (selectedPlant === plant) {
      setFeedback(`${label}已经种下了`)
      return
    }

    choosePlant(plant)
    setFeedback(`已经种下${label}`)
  }

  return (
    <main style={{ padding: '20px 0' }}>
      <Card style={{ display: 'grid', gap: '20px' }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: '8px' }}>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>成长花园</p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>今天也来给花园浇浇水</h1>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 230, 109, 0.22)',
              textAlign: 'center',
            }}
          >
            <strong style={{ fontSize: '1.4rem' }}>⭐ {totalStars}</strong>
            <div style={{ color: 'var(--color-text-light)' }}>当前星星</div>
          </div>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 179, 71, 0.2)',
              textAlign: 'center',
            }}
          >
            <strong style={{ fontSize: '1.4rem' }}>🔥 {currentStreak}</strong>
            <div style={{ color: 'var(--color-text-light)' }}>连续学习</div>
          </div>
        </div>
        <GardenGrowth plant={selectedPlant} stage={gardenStage} />
        {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid var(--color-surface-border)',
            color: 'var(--color-text-light)',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--color-text)' }}>花园规则</strong>
          <div>完成一次今日任务才会增加星星和成长阶段。</div>
          <div>向日葵默认解锁；草莓需要 {STRAWBERRY_UNLOCK_STARS} 颗星星；郁金香需要连续学习 {TULIP_UNLOCK_STREAK} 天。</div>
          <div>选择植物只会切换当前花园展示，不会额外加星星。</div>
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          <Button
            variant="secondary"
            onClick={() => handleChoosePlant('sunflower', '向日葵')}
          >
            {selectedPlant === 'sunflower' ? '已种向日葵' : '选向日葵'}
          </Button>
          <div style={{ marginTop: '-4px', color: 'var(--color-text-light)', textAlign: 'center' }}>
            {getPlantUnlockText('sunflower', stats)}
          </div>
          <Button
            variant="secondary"
            disabled={!isPlantUnlocked('strawberry', stats)}
            onClick={() => handleChoosePlant('strawberry', '草莓')}
          >
            {selectedPlant === 'strawberry' ? '已种草莓' : '选草莓'}
          </Button>
          <div style={{ marginTop: '-4px', color: 'var(--color-text-light)', textAlign: 'center' }}>
            {getPlantUnlockText('strawberry', stats)}
          </div>
          <Button
            variant="secondary"
            disabled={!isPlantUnlocked('tulip', stats)}
            onClick={() => handleChoosePlant('tulip', '郁金香')}
          >
            {selectedPlant === 'tulip' ? '已种郁金香' : '选郁金香'}
          </Button>
          <div style={{ marginTop: '-4px', color: 'var(--color-text-light)', textAlign: 'center' }}>
            {getPlantUnlockText('tulip', stats)}
          </div>
        </div>
        <Button onClick={() => onNavigate('today')}>回到今日任务</Button>
      </Card>
    </main>
  )
}

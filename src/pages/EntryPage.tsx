import { useState } from 'react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { DEFAULT_PROFILE_ID, generateProfileId, normalizeProfileId } from '../features/profile/profileId'

type EntryPageProps = {
  lastProfileId?: string
  onChooseTemporary: (profileId: string) => void
  onChooseNamed: (profileId: string) => void
}

export function EntryPage({
  lastProfileId,
  onChooseTemporary,
  onChooseNamed,
}: EntryPageProps) {
  const [namedProfile, setNamedProfile] = useState(lastProfileId || DEFAULT_PROFILE_ID)
  const [message, setMessage] = useState<string | null>(null)

  function handleContinueNamed() {
    const normalized = normalizeProfileId(namedProfile)
    if (!normalized) {
      setMessage('先输入一个名字，再继续。')
      return
    }

    setMessage(null)
    onChooseNamed(normalized)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '620px',
          display: 'grid',
          gap: '20px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>开始今天的学习</p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 8vw, 4rem)',
            lineHeight: 1.05,
          }}
        >
          先选一种进入方式
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          临时使用适合马上开始；继续我的记录适合找回同一台设备上的学习历史。
        </p>

        <div
          style={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          <Card
            style={{
              display: 'grid',
              gap: '14px',
              background: 'rgba(255,255,255,0.78)',
            }}
          >
            <div style={{ fontSize: '2rem' }}>✨</div>
            <strong style={{ fontSize: '1.2rem' }}>临时使用</strong>
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
              给这次学习开一个临时名字，适合试用或现场练习。
            </p>
            <Button onClick={() => onChooseTemporary(generateProfileId())}>临时开始</Button>
          </Card>

          <Card
            style={{
              display: 'grid',
              gap: '14px',
              background: 'rgba(255,255,255,0.78)',
            }}
          >
            <div style={{ fontSize: '2rem' }}>📘</div>
            <strong style={{ fontSize: '1.2rem' }}>继续我的记录</strong>
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
              输入一个好记的名字，比如 <strong>{DEFAULT_PROFILE_ID}</strong>。
            </p>
            <input
              aria-label="继续我的记录"
              value={namedProfile}
              onChange={(event) => setNamedProfile(event.target.value)}
              placeholder={DEFAULT_PROFILE_ID}
              style={{
                width: '100%',
                minHeight: '48px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-surface-border)',
                padding: '0 16px',
                background: 'rgba(255,255,255,0.92)',
                textAlign: 'center',
                fontWeight: 700,
              }}
            />
            <Button variant="secondary" onClick={handleContinueNamed}>
              继续学习
            </Button>
          </Card>
        </div>

        {message ? <p style={{ margin: 0, color: '#b25b00' }}>{message}</p> : null}
      </Card>
    </main>
  )
}

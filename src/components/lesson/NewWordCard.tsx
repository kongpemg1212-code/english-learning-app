import { useState } from 'react'

import { WordVisual } from '../ui/WordVisual'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

import type { WordItem } from '../../types/word'

type NewWordCardProps = {
  word: WordItem
  onConfirm?: () => void
}

export function NewWordCard({ word, onConfirm }: NewWordCardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <Card
      style={{
        display: 'grid',
        gap: '20px',
        textAlign: 'center',
      }}
    >
      <div
        aria-label={flipped ? `${word.word} 卡片` : '卡背'}
        style={{
          width: '100%',
          minHeight: '180px',
          borderRadius: 'var(--radius-lg)',
          background:
            'radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(255, 230, 109, 0.45))',
          display: 'grid',
          placeItems: 'center',
          fontSize: '4rem',
          border: 'none',
        }}
      >
        {flipped ? (
          <WordVisual word={word} size="lg" />
        ) : (
          <div style={{ display: 'grid', gap: '12px', justifyItems: 'center' }}>
            <div>🎁</div>
            <strong style={{ fontSize: '1.2rem' }}>先翻开卡片</strong>
          </div>
        )}
      </div>

      {!flipped ? (
        <>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            先点下面按钮，翻开后才会看到单词和中文。
          </p>
          <Button onClick={() => setFlipped(true)}>翻开看看</Button>
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '8px' }}>
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: '2.4rem',
              }}
            >
              {word.word}
            </h2>
            <p style={{ margin: 0, fontSize: '1.2rem', color: 'var(--color-text-light)' }}>
              {word.meaningZh}
            </p>
            {word.example ? (
              <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{word.example}</p>
            ) : null}
          </div>
          <Button variant="secondary" onClick={onConfirm}>
            我认识啦
          </Button>
        </>
      )}
    </Card>
  )
}

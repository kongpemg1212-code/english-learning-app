import { SpeakButton } from '../ui/SpeakButton'
import { useSpeech } from '../../hooks/useSpeech'
import { Card } from '../ui/Card'

import type { WordItem } from '../../types/word'

type BossReviewProps = {
  words: WordItem[]
  onComplete?: () => void
}

export function BossReview({ words, onComplete }: BossReviewProps) {
  const { speak } = useSpeech()

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>Boss 关</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>最终挑战</h2>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          新词和旧词混在一起，看看你记住了多少。
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
        }}
      >
        {words.map((word) => (
          <div
            key={word.id}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.75)',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <strong>{word.word}</strong>
            <p style={{ margin: '8px 0 0', color: 'var(--color-text-light)' }}>{word.meaningZh}</p>
            <div style={{ marginTop: '10px' }}>
              <SpeakButton
                label="听单词"
                onClick={() => void speak(word.word, { audioUrl: word.audio, kind: 'word' })}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onComplete}
        style={{
          minHeight: '64px',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        完成挑战
      </button>
    </Card>
  )
}

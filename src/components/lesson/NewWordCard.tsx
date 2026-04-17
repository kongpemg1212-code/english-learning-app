import { useState } from 'react'

import { WordVisual } from '../ui/WordVisual'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SpeakButton } from '../ui/SpeakButton'
import { useSpeech } from '../../hooks/useSpeech'

import type { WordItem } from '../../types/word'

type NewWordCardProps = {
  word: WordItem
  onConfirm?: () => void
}

export function NewWordCard({ word, onConfirm }: NewWordCardProps) {
  const [flipped, setFlipped] = useState(false)
  const { speak } = useSpeech()

  return (
    <Card
      style={{
        display: 'grid',
        gap: '20px',
        textAlign: 'center',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={flipped ? `${word.word} 卡片正面` : `${word.word} 卡片背面`}
        onClick={() => setFlipped((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setFlipped((value) => !value)
          }
        }}
        style={{
          width: '100%',
          minHeight: '280px',
          perspective: '1200px',
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '280px',
            transformStyle: 'preserve-3d',
            transition: 'transform 420ms ease',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--radius-lg)',
              background:
                'radial-gradient(circle at top, rgba(255,255,255,0.98), rgba(255, 230, 109, 0.55))',
              display: 'grid',
              gap: '16px',
              placeItems: 'center',
              padding: '24px',
              backfaceVisibility: 'hidden',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <WordVisual word={word} size="lg" />
            <div style={{ display: 'grid', gap: '8px' }}>
              <strong style={{ fontSize: '1.35rem' }}>猜猜这张卡片是什么</strong>
              <span style={{ color: 'var(--color-text-light)' }}>点卡片翻面，再听一听这个单词。</span>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.96)',
              display: 'grid',
              gap: '12px',
              alignContent: 'center',
              justifyItems: 'center',
              padding: '24px',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              border: '1px solid var(--color-surface-border)',
            }}
          >
            <WordVisual word={word} size="md" />
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
            {word.exampleZh ? (
              <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{word.exampleZh}</p>
            ) : null}
          </div>
        </div>
      </div>

      {!flipped ? (
        <>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            先看图，再点卡片翻面。翻开后会看到单词、中文和例句。
          </p>
          <Button onClick={() => setFlipped(true)}>翻开闪卡</Button>
        </>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Button
              variant="secondary"
              onClick={() => void speak(word.word, { audioUrl: word.audio, kind: 'word' })}
            >
              听一听发音
            </Button>
            {word.example ? (
              <SpeakButton
                label="听例句"
                onClick={() => void speak(word.example ?? '', { kind: 'sentence' })}
                style={{ justifySelf: 'center' }}
              />
            ) : null}
            <Button variant="ghost" onClick={() => setFlipped(false)}>
              再看一次图片面
            </Button>
          </div>
          <Button variant="secondary" onClick={onConfirm}>
            我认识啦
          </Button>
        </>
      )}
    </Card>
  )
}

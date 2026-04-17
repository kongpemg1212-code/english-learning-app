import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SpeakButton } from '../ui/SpeakButton'
import { WordVisual } from '../ui/WordVisual'
import { useSpeech } from '../../hooks/useSpeech'

import type { ChoiceGameProps } from '../../types/game'

export function AudioChoice({ promptWord, options, onAnswer }: ChoiceGameProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [played, setPlayed] = useState(false)
  const { speak } = useSpeech()

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>听音点图</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
          听一听，选出刚才听到的单词
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '14px',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.76)',
          border: '1px solid var(--color-surface-border)',
          justifyItems: 'center',
        }}
      >
        <p style={{ margin: 0, color: 'var(--color-text-light)', textAlign: 'center' }}>
          先听单词，再看下面哪张图片最像刚才听到的内容。
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
          <SpeakButton
            label="听单词"
            onClick={() => {
              void speak(promptWord.word, { audioUrl: promptWord.audio, kind: 'word' })
              setPlayed(true)
            }}
          />
          {promptWord.example ? (
            <SpeakButton
              label="听例句"
              onClick={() => {
                void speak(promptWord.example ?? '', { kind: 'sentence' })
                setPlayed(true)
              }}
            />
          ) : null}
        </div>
      </div>

      {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))',
          gap: '12px',
        }}
      >
        {options.map((option) => (
          <Button
            key={option.id}
            aria-label={option.word}
            variant="ghost"
            onClick={() => {
              const correct = option.id === promptWord.id
              setFeedback(correct ? '太棒了！' : '快接近啦')
              onAnswer({
                correct,
                wordId: promptWord.id,
                selectedWordId: option.id,
                mode: 'audio-choice',
              })
            }}
            disabled={!played}
            style={{
              minHeight: '180px',
              borderRadius: '24px',
              padding: '14px 12px',
              border: '1px solid rgba(255, 107, 107, 0.12)',
            }}
          >
            <div style={{ display: 'grid', gap: '8px', justifyItems: 'center' }}>
              <WordVisual word={option} size="md" />
              <span>{option.word}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}

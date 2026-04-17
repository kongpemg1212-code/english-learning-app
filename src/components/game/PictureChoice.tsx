import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SpeakButton } from '../ui/SpeakButton'
import { WordVisual } from '../ui/WordVisual'
import { useSpeech } from '../../hooks/useSpeech'

import type { ChoiceGameProps } from '../../types/game'

export function PictureChoice({ promptWord, options, onAnswer }: ChoiceGameProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const { speak } = useSpeech()

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>看图选词</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
          找到正确的英文单词
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gap: '14px',
          justifyItems: 'center',
          padding: '18px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.76)',
          border: '1px solid var(--color-surface-border)',
        }}
      >
        <WordVisual word={promptWord} size="md" />
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '0 18px',
            borderRadius: '999px',
            background: 'rgba(255, 230, 109, 0.22)',
            fontWeight: 800,
          }}
        >
          {promptWord.meaningZh}
        </div>
        {promptWord.example ? (
          <div style={{ display: 'grid', gap: '8px', justifyItems: 'center' }}>
            <p style={{ margin: 0, color: 'var(--color-text-light)', textAlign: 'center' }}>
              常用句：{promptWord.example}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
              <SpeakButton
                label="听单词"
                onClick={() => void speak(promptWord.word, { audioUrl: promptWord.audio, kind: 'word' })}
              />
              <SpeakButton
                label="听例句"
                onClick={() => void speak(promptWord.example ?? '', { kind: 'sentence' })}
              />
            </div>
          </div>
        ) : (
          <SpeakButton
            label="听单词"
            onClick={() => void speak(promptWord.word, { audioUrl: promptWord.audio, kind: 'word' })}
          />
        )}
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
            variant={option.id === promptWord.id ? 'secondary' : 'ghost'}
            onClick={() => {
              const correct = option.id === promptWord.id
              setFeedback(correct ? '答对啦！' : '没关系，再试一次')
              onAnswer({
                correct,
                wordId: promptWord.id,
                selectedWordId: option.id,
                mode: 'picture-choice',
              })
            }}
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

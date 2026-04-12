import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { WordVisual } from '../ui/WordVisual'

import type { ChoiceGameProps } from '../../types/game'

export function AudioChoice({ promptWord, options, onAnswer }: ChoiceGameProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const [played, setPlayed] = useState(false)

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>听音点图</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
          听一听，选出刚才听到的单词
        </h2>
      </div>

      <Button
        variant="secondary"
        onClick={() => {
          if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
            window.speechSynthesis.cancel()
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(promptWord.word))
          }
          setPlayed(true)
        }}
      >
        播放发音
      </Button>

      {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}

      <div style={{ display: 'grid', gap: '12px' }}>
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
          >
            <div style={{ display: 'grid', gap: '8px', justifyItems: 'center' }}>
              <WordVisual word={option} size="sm" />
              <span>{option.word}</span>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  )
}

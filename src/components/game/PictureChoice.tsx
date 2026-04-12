import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { WordVisual } from '../ui/WordVisual'

import type { ChoiceGameProps } from '../../types/game'

export function PictureChoice({ promptWord, options, onAnswer }: ChoiceGameProps) {
  const [feedback, setFeedback] = useState<string | null>(null)

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>看图选词</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
          找到正确的英文单词
        </h2>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{promptWord.meaningZh}</p>
        {promptWord.example ? (
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>常用句：{promptWord.example}</p>
        ) : null}
      </div>

      {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}

      <div style={{ display: 'grid', gap: '12px' }}>
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

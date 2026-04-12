import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

import type { GameAnswer } from '../../types/game'
import type { WordItem } from '../../types/word'

type MatchPairsProps = {
  words: WordItem[]
  onAnswer: (answer: GameAnswer) => void
}

export function MatchPairs({ words, onAnswer }: MatchPairsProps) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>拖拽配对</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>把单词和中文连起来</h2>
      </div>

      {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}

      <div style={{ display: 'grid', gap: '10px' }}>
        {words.map((word) => (
          <Button key={word.id} variant="ghost" onClick={() => setSelectedWordId(word.id)}>
            {word.word}
          </Button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {words.map((word) => (
          <Button
            key={`${word.id}-meaning`}
            variant="secondary"
            onClick={() => {
              const correct = selectedWordId === word.id
              setFeedback(correct ? '配对成功！' : '再试试看')
              onAnswer({
                correct,
                wordId: selectedWordId ?? word.id,
                selectedWordId: word.id,
                mode: 'match-pairs',
              })
            }}
          >
            {word.meaningZh}
          </Button>
        ))}
      </div>
    </Card>
  )
}

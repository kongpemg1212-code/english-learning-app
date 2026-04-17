import { useState } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { SpeakButton } from '../ui/SpeakButton'
import { useSpeech } from '../../hooks/useSpeech'

import type { GameAnswer } from '../../types/game'
import type { WordItem } from '../../types/word'

type MatchPairsProps = {
  words: WordItem[]
  onAnswer: (answer: GameAnswer) => void
}

export function MatchPairs({ words, onAnswer }: MatchPairsProps) {
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const { speak } = useSpeech()

  return (
    <Card style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'grid', gap: '6px', textAlign: 'center' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>拖拽配对</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>把单词和中文连起来</h2>
        {words[0]?.example ? (
          <div style={{ display: 'grid', gap: '8px', justifyItems: 'center' }}>
            <p style={{ margin: 0, color: 'var(--color-text-light)' }}>常用句：{words[0].example}</p>
            <SpeakButton
              label="听例句"
              onClick={() => void speak(words[0].example ?? '', { kind: 'sentence' })}
            />
          </div>
        ) : null}
      </div>

      {feedback ? <AnswerFeedback state="correct" message={feedback} /> : null}

      <div style={{ display: 'grid', gap: '10px' }}>
        {words.map((word) => (
          <div key={word.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
            <Button variant="ghost" onClick={() => setSelectedWordId(word.id)}>
              {word.word}
            </Button>
            <SpeakButton
              label="听词"
              onClick={() => void speak(word.word, { audioUrl: word.audio, kind: 'word' })}
            />
          </div>
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

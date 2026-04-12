import { useMemo } from 'react'

import { AnswerFeedback } from '../feedback/AnswerFeedback'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

import type { GameAnswer } from '../../types/game'
import type { WordItem } from '../../types/word'

type SpellBlocksProps = {
  word: WordItem
  onAnswer: (answer: GameAnswer) => void
}

export function SpellBlocks({ word, onAnswer }: SpellBlocksProps) {
  const middleIndex = Math.floor(word.word.length / 2)
  const missingLetter = word.word[middleIndex] ?? word.word[0]
  const options = useMemo(() => {
    const filler = ['a', 'e', 'i', 'o', 'u', 't', 'n']
    return Array.from(new Set([missingLetter, ...filler])).slice(0, 4)
  }, [missingLetter])

  return (
    <Card style={{ display: 'grid', gap: '20px', textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: '6px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>拼写补全</p>
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>补上缺失的字母</h2>
        <p style={{ margin: 0, fontSize: '2rem' }}>
          {word.word.slice(0, middleIndex)}
          _
          {word.word.slice(middleIndex + 1)}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {options.map((option) => (
          <Button
            key={option}
            variant={option === missingLetter ? 'secondary' : 'ghost'}
            onClick={() => {
              onAnswer({
                correct: option === missingLetter,
                wordId: word.id,
                selectedWordId: option,
                mode: 'spell-blocks',
              })
            }}
          >
            {option}
          </Button>
        ))}
      </div>

      <AnswerFeedback state="combo" message={`提示：${word.meaningZh}`} />
    </Card>
  )
}

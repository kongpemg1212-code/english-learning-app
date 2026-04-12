import type { WordItem } from './word'

export type GameAnswer = {
  correct: boolean
  wordId: string
  selectedWordId: string
  mode: 'picture-choice' | 'audio-choice' | 'match-pairs' | 'spell-blocks' | 'boss-review'
}

export type ChoiceGameProps = {
  promptWord: WordItem
  options: WordItem[]
  onAnswer: (answer: GameAnswer) => void
}

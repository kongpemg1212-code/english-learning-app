export type GameMode =
  | 'picture-choice'
  | 'audio-choice'
  | 'match-pairs'
  | 'spell-blocks'
  | 'boss-review'
  | 'surprise'

export type DailySession = {
  date: string
  packId?: string
  topicId?: string
  newWords: string[]
  reviewWords: string[]
  challengeWords: string[]
  modeSequence: GameMode[]
  estimatedMinutes: number
  status: 'todo' | 'done'
}

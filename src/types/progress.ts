export type WordStatus = 'new' | 'learning' | 'review' | 'mastered'

export type WordProgress = {
  wordId: string
  stage: 0 | 1 | 2 | 3 | 4 | 5
  seenCount: number
  correctCount: number
  wrongCount: number
  consecutiveCorrect: number
  lastReviewedAt?: string
  nextReviewAt?: string
  status: WordStatus
}

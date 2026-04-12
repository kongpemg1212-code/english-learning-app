import type { WordProgress } from '../types/progress'

const STAGE_INTERVALS: Record<WordProgress['stage'], number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
}

export function createInitialProgress(wordId: string): WordProgress {
  return {
    wordId,
    stage: 0,
    seenCount: 0,
    correctCount: 0,
    wrongCount: 0,
    consecutiveCorrect: 0,
    status: 'new',
  }
}

function addDays(date: string, days: number) {
  const next = new Date(`${date}T00:00:00Z`)
  next.setUTCDate(next.getUTCDate() + days)
  return next.toISOString().slice(0, 10)
}

export function recordAnswer(
  progress: WordProgress,
  result: 'correct' | 'wrong',
  reviewedAt: string,
): WordProgress {
  if (result === 'correct') {
    const nextStage = Math.min(progress.stage + 1, 5) as WordProgress['stage']

    return {
      ...progress,
      stage: nextStage,
      seenCount: progress.seenCount + 1,
      correctCount: progress.correctCount + 1,
      consecutiveCorrect: progress.consecutiveCorrect + 1,
      status: nextStage >= 5 ? 'mastered' : 'review',
      lastReviewedAt: reviewedAt,
      nextReviewAt: addDays(reviewedAt, STAGE_INTERVALS[nextStage]),
    }
  }

  return {
    ...progress,
    stage: 1,
    seenCount: progress.seenCount + 1,
    wrongCount: progress.wrongCount + 1,
    consecutiveCorrect: 0,
    status: 'learning',
    lastReviewedAt: reviewedAt,
    nextReviewAt: reviewedAt,
  }
}

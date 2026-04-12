import type { WordProgress } from '../types/progress'
import type { DailySession, GameMode } from '../types/session'

type BuildDailySessionInput = {
  date: string
  packId?: string
  topicId?: string
  dueWordIds: string[]
  newWordIds: string[]
  wrongWordIds?: string[]
  modeSeed?: number
}

const modePatterns: GameMode[][] = [
  ['picture-choice', 'audio-choice', 'match-pairs', 'boss-review'],
  ['audio-choice', 'picture-choice', 'spell-blocks', 'boss-review'],
  ['match-pairs', 'picture-choice', 'audio-choice', 'boss-review'],
]

function unique<T>(items: T[]) {
  return [...new Set(items)]
}

type PickAdaptiveWordsInput = {
  topicWordIds: string[]
  progressRecords: WordProgress[]
  date: string
}

export function pickAdaptiveWords({
  topicWordIds,
  progressRecords,
  date,
}: PickAdaptiveWordsInput) {
  const progressByWordId = new Map(progressRecords.map((record) => [record.wordId, record]))
  const dueWordIds: string[] = []
  const newWordIds: string[] = []
  const wrongWordIds: string[] = []

  for (const wordId of topicWordIds) {
    const progress = progressByWordId.get(wordId)

    if (!progress || progress.seenCount === 0) {
      newWordIds.push(wordId)
      continue
    }

    if (progress.status !== 'mastered' && (!progress.nextReviewAt || progress.nextReviewAt <= date)) {
      dueWordIds.push(wordId)
    }

    if (progress.wrongCount > 0 && progress.status !== 'mastered') {
      wrongWordIds.push(wordId)
    }
  }

  const orderedDueWordIds = dueWordIds.sort((left, right) => {
    const leftProgress = progressByWordId.get(left)
    const rightProgress = progressByWordId.get(right)
    return (leftProgress?.stage ?? 0) - (rightProgress?.stage ?? 0)
  })

  const cappedNewWordIds = orderedDueWordIds.length >= 8 ? [] : newWordIds.slice(0, 3)

  return {
    dueWordIds: orderedDueWordIds,
    newWordIds: cappedNewWordIds,
    wrongWordIds,
  }
}

export function buildDailySession({
  date,
  packId,
  topicId,
  dueWordIds,
  newWordIds,
  wrongWordIds = [],
  modeSeed = 0,
}: BuildDailySessionInput): DailySession {
  const reviewWords = dueWordIds.slice(0, 8)
  const newWords = newWordIds.slice(0, 3)
  const challengeWords = unique([...wrongWordIds, ...reviewWords.slice(0, 2), ...newWords.slice(0, 2)]).slice(0, 6)
  const modeSequence = modePatterns[modeSeed % modePatterns.length]

  return {
    date,
    packId,
    topicId,
    newWords,
    reviewWords,
    challengeWords,
    modeSequence,
    estimatedMinutes: Math.max(6, Math.min(10, 4 + reviewWords.length / 2 + newWords.length)),
    status: 'todo',
  }
}

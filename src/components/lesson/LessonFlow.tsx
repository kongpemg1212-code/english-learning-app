import { useMemo, useState } from 'react'

import { BossReview } from '../game/BossReview'
import { AudioChoice } from '../game/AudioChoice'
import { MatchPairs } from '../game/MatchPairs'
import { PictureChoice } from '../game/PictureChoice'
import { SpellBlocks } from '../game/SpellBlocks'
import { CelebrationBurst } from '../feedback/CelebrationBurst'

import { calculateMissionStars } from '../../engine/scoring'
import { createInitialProgress, recordAnswer } from '../../engine/scheduler'
import { getDailySessionRepo } from '../../storage/repositories/dailySessionRepo'
import { getWordProgressRepo } from '../../storage/repositories/wordProgressRepo'
import { useAppStore } from '../../store/useAppStore'
import type { DailySession } from '../../types/session'
import type { WordItem } from '../../types/word'

import { NewWordCard } from './NewWordCard'

type LessonFlowProps = {
  session: DailySession
  words: WordItem[]
  onNavigate: (route: 'today' | 'map' | 'garden' | 'progress' | 'parent') => void
}

export function LessonFlow({ session, words, onNavigate }: LessonFlowProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const currentWord = words.find((word) => word.id === session.newWords[0]) ?? words[0]
  const completeMission = useAppStore((state) => state.completeMission)
  const lessonWords = useMemo(
    () => words.filter((word) => session.newWords.includes(word.id)),
    [session.newWords, words],
  )
  const reviewLessonWords = useMemo(
    () => words.filter((word) => session.reviewWords.includes(word.id)),
    [session.reviewWords, words],
  )
  const practiceWords = useMemo(() => {
    const merged = [...lessonWords, ...reviewLessonWords]
    return merged.filter((word, index) => merged.findIndex((item) => item.id === word.id) === index)
  }, [lessonWords, reviewLessonWords])
  const relatedTopicWords = useMemo(() => {
    if (!session.topicId) {
      return words
    }

    const sameTopic = words.filter((word) => word.topic === session.topicId)
    return sameTopic.length > 0 ? sameTopic : words
  }, [session.topicId, words])

  const currentMode = session.modeSequence[stepIndex - 1]
  const activeWord =
    practiceWords[(Math.max(stepIndex - 1, 0)) % Math.max(practiceWords.length, 1)] ?? currentWord
  const optionWords = useMemo(() => {
    const seedWord = activeWord ?? relatedTopicWords[0]
    if (!seedWord) {
      return []
    }

    const distractors = relatedTopicWords.filter((word) => word.id !== seedWord.id)
    return [seedWord, ...distractors].slice(0, 4)
  }, [activeWord, relatedTopicWords])
  const bossWords = words.filter(
    (word) => session.challengeWords.includes(word.id) || session.newWords.includes(word.id),
  )

  if (!currentWord) {
    return null
  }

  async function recordPractice(wordId: string, correct: boolean) {
    const repo = getWordProgressRepo()
    const existing = await repo.get(wordId)
    const next = recordAnswer(
      existing ?? createInitialProgress(wordId),
      correct ? 'correct' : 'wrong',
      session.date,
    )
    await repo.save(next)
  }

  async function finishMission() {
    const earnedStars = calculateMissionStars(correctAnswers)
    completeMission(session.date, earnedStars)
    onNavigate('garden')
    void getDailySessionRepo()
      .save({
        ...session,
        status: 'done',
      })
      .catch(() => undefined)
  }

  return (
    <section
      style={{
        width: '100%',
        maxWidth: '560px',
        display: 'grid',
        gap: '20px',
      }}
    >
      <div style={{ textAlign: 'center', display: 'grid', gap: '8px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>第一步</p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.1rem, 6vw, 3.4rem)',
          }}
        >
          {stepIndex === 0 ? '发现新朋友' : '开始小游戏'}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          {stepIndex === 0
            ? '先动手翻开卡片，再进入后面的小游戏。'
            : '每次答对一小步，就离今天的奖励更近一点。'}
        </p>
      </div>
      {stepIndex === 0 ? (
        <NewWordCard word={currentWord} onConfirm={() => setStepIndex(1)} />
      ) : currentMode === 'picture-choice' ? (
        <PictureChoice
          promptWord={activeWord}
          options={optionWords}
          onAnswer={(answer) => {
            if (answer.correct) {
              setCorrectAnswers((value) => value + 1)
            }
            void recordPractice(answer.wordId, answer.correct)
            setStepIndex((step) => step + 1)
          }}
        />
      ) : currentMode === 'audio-choice' ? (
        <AudioChoice
          promptWord={activeWord}
          options={optionWords}
          onAnswer={(answer) => {
            if (answer.correct) {
              setCorrectAnswers((value) => value + 1)
            }
            void recordPractice(answer.wordId, answer.correct)
            setStepIndex((step) => step + 1)
          }}
        />
      ) : currentMode === 'match-pairs' ? (
        <MatchPairs
          words={optionWords}
          onAnswer={(answer) => {
            if (answer.correct) {
              setCorrectAnswers((value) => value + 1)
            }
            void recordPractice(answer.wordId, answer.correct)
            setStepIndex((step) => step + 1)
          }}
        />
      ) : currentMode === 'spell-blocks' ? (
        <SpellBlocks
          word={activeWord}
          onAnswer={(answer) => {
            if (answer.correct) {
              setCorrectAnswers((value) => value + 1)
            }
            void recordPractice(answer.wordId, answer.correct)
            setStepIndex((step) => step + 1)
          }}
        />
      ) : (
        <section style={{ width: '100%', maxWidth: '560px', position: 'relative' }}>
          <CelebrationBurst active={correctAnswers > 0} />
          <BossReview words={bossWords} onComplete={() => void finishMission()} />
        </section>
      )}
    </section>
  )
}

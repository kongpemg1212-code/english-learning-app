import { useEffect, useMemo, useState } from 'react'

import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { SpeakButton } from '../components/ui/SpeakButton'
import { getActiveWordPack } from '../data/word-packs/activePack'
import { generateStory } from '../features/story/storyProvider'
import { useSpeech } from '../hooks/useSpeech'
import type { AppRoute } from '../routes'
import { getDailySessionRepo } from '../storage/repositories/dailySessionRepo'
import { getStoryRepo } from '../storage/repositories/storyRepo'
import { useAppStore } from '../store/useAppStore'
import type { StoryPayload } from '../types/story'
import type { WordItem } from '../types/word'

type StoryPageProps = {
  onNavigate: (route: AppRoute) => void
}

function uniqueWords(words: WordItem[]) {
  return words.filter((word, index) => words.findIndex((item) => item.id === word.id) === index)
}

export function StoryPage({ onNavigate }: StoryPageProps) {
  const profileId = useAppStore((state) => state.cloudProfileId)
  const lastCompletedDate = useAppStore((state) => state.lastCompletedDate)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const activePack = useMemo(
    () => getActiveWordPack(importedPacks, selectedPackId),
    [importedPacks, selectedPackId],
  )
  const [story, setStory] = useState<StoryPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedWord, setExpandedWord] = useState<string | null>(null)
  const [answer, setAnswer] = useState<string | null>(null)
  const [assistantMessage, setAssistantMessage] = useState<string | null>(null)
  const { speak } = useSpeech()

  useEffect(() => {
    let cancelled = false

    async function loadStory() {
      if (!profileId || !lastCompletedDate) {
        setLoading(false)
        return
      }

      const sessions = await getDailySessionRepo().list()
      const completedSession =
        sessions.find((item) => item.date === lastCompletedDate) ??
        sessions.find((item) => item.status === 'done') ??
        sessions[0]

      if (!completedSession) {
        setLoading(false)
        return
      }

      const topicId = completedSession.topicId ?? activePack.topics[0]?.id ?? 'today'
      const cached = await getStoryRepo().get(completedSession.date, topicId)
      if (cached) {
        if (!cancelled) {
          setStory(cached)
          setLoading(false)
        }
        return
      }

      const storyWords = uniqueWords(
        [...completedSession.newWords, ...completedSession.reviewWords, ...completedSession.challengeWords]
          .map((wordId) => activePack.words.find((word) => word.id === wordId))
          .filter((word): word is WordItem => Boolean(word)),
      )

      const generated = await generateStory({
        profileId,
        date: completedSession.date,
        topicId,
        words:
          storyWords.length > 0
            ? storyWords
            : activePack.words.filter((word) => word.topic === topicId).slice(0, 4),
      })

      await getStoryRepo().save(completedSession.date, topicId, generated)

      if (!cancelled) {
        setStory(generated)
        setLoading(false)
      }
    }

    void loadStory()

    return () => {
      cancelled = true
    }
  }, [activePack.topics, activePack.words, lastCompletedDate, profileId])

  if (!lastCompletedDate) {
    return (
      <main style={{ padding: '20px 0' }}>
        <Card style={{ display: 'grid', gap: '16px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>先完成今天的任务</h1>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            完成任务后，小故事会在这里解锁。
          </p>
          <Button onClick={() => onNavigate('today')}>去做今日任务</Button>
        </Card>
      </main>
    )
  }

  return (
    <main style={{ padding: '20px 0', display: 'grid', gap: '16px' }}>
      <Card style={{ display: 'grid', gap: '18px' }}>
        <div style={{ display: 'grid', gap: '8px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>今日故事</p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
            {loading ? '正在准备小故事…' : story?.title ?? '今天的小故事'}
          </h1>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
            用今天练过的单词，读一个短短的小故事。
          </p>
        </div>

        {loading ? (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--color-text-light)' }}>
            正在整理故事卡片…
          </p>
        ) : story ? (
          <>
            <div style={{ display: 'grid', gap: '12px' }}>
              {story.sentences.map((sentence, index) => (
                <section
                  key={`${sentence.text}-${index}`}
                  style={{
                    display: 'grid',
                    gap: '10px',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(255,255,255,0.78)',
                    border: '1px solid var(--color-surface-border)',
                  }}
                >
                  <strong style={{ fontSize: '1.15rem' }}>{sentence.text}</strong>
                  <span style={{ color: 'var(--color-text-light)' }}>{sentence.zh}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <SpeakButton
                      label="听这句"
                      onClick={() => void speak(sentence.text, { kind: 'sentence' })}
                    />
                    <SpeakButton
                      label="跟读"
                      onClick={() => void speak(sentence.text, { kind: 'sentence' })}
                    />
                  </div>
                  {sentence.newWords.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {sentence.newWords.map((word) => (
                        <button
                          key={word.word}
                          type="button"
                          onClick={() =>
                            setExpandedWord(expandedWord === word.word ? null : word.word)
                          }
                          style={{
                            border: '1px solid var(--color-surface-border)',
                            borderRadius: '999px',
                            padding: '8px 12px',
                            background: 'rgba(255,230,109,0.22)',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          {word.word}
                          {expandedWord === word.word ? `：${word.meaningZh}` : ''}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>

            {story.questions[0] ? (
              <section style={{ display: 'grid', gap: '10px' }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>小问题</h2>
                <p style={{ margin: 0 }}>{story.questions[0].question}</p>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {story.questions[0].choices.map((choice) => (
                    <Button
                      key={choice}
                      variant={answer === choice ? 'secondary' : 'ghost'}
                      onClick={() => setAnswer(choice)}
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
                {answer ? (
                  <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
                    {answer === story.questions[0].answer
                      ? '答对啦！'
                      : `答案是 ${story.questions[0].answer}`}
                  </p>
                ) : null}
              </section>
            ) : null}

            <section
              style={{
                display: 'grid',
                gap: '10px',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(245,251,255,0.82)',
                border: '1px solid rgba(125,198,255,0.28)',
              }}
            >
              <strong>和 AI 说一说</strong>
              <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
                先用安全按钮互动，后面再开放更自由的提问。
              </p>
              <div style={{ display: 'grid', gap: '8px' }}>
                <Button variant="ghost" onClick={() => setAssistantMessage('当然，我们可以再读一遍这个故事。')}>
                  再讲一次
                </Button>
                <Button variant="ghost" onClick={() => setAssistantMessage('我会讲简单一点：Maya 学了新单词，然后开心地练习。')}>
                  讲简单一点
                </Button>
                <Button variant="ghost" onClick={() => setAssistantMessage('请先回答上面的小问题，我会帮你看答案。')}>
                  我想回答问题
                </Button>
              </div>
              {assistantMessage ? (
                <p style={{ margin: 0, color: 'var(--color-text)' }}>{assistantMessage}</p>
              ) : null}
            </section>
          </>
        ) : (
          <p style={{ margin: 0, textAlign: 'center', color: 'var(--color-text-light)' }}>
            还没有找到今天的故事。
          </p>
        )}

        <Button variant="secondary" onClick={() => onNavigate('garden')}>回到花园</Button>
      </Card>
    </main>
  )
}

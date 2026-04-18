import { buildFallbackStory } from './fallbackStory'

import type { StoryPayload } from '../../types/story'
import type { WordItem } from '../../types/word'

declare const __AI_STORY_PROXY_URL__: string | undefined

type StoryProviderInput = {
  profileId: string
  date: string
  topicId: string
  words: WordItem[]
}

type StoryProxyResponse = StoryPayload

function isStoryPayload(value: unknown): value is StoryPayload {
  if (!value || typeof value !== 'object') {
    return false
  }

  const payload = value as StoryPayload
  return Boolean(
    payload.title &&
      payload.topicId &&
      Array.isArray(payload.sentences) &&
      Array.isArray(payload.questions),
  )
}

async function requestProxyStory(input: StoryProviderInput): Promise<StoryPayload | null> {
  const endpoint =
    typeof __AI_STORY_PROXY_URL__ !== 'undefined' ? __AI_STORY_PROXY_URL__ : undefined
  if (!endpoint) {
    return null
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profileId: input.profileId,
      date: input.date,
      topicId: input.topicId,
      words: input.words.map((word) => ({
        word: word.word,
        meaningZh: word.meaningZh,
        example: word.example,
      })),
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as StoryProxyResponse
  return isStoryPayload(data) ? data : null
}

export async function generateStory(input: StoryProviderInput) {
  try {
    const proxyStory = await requestProxyStory(input)
    if (proxyStory) {
      return proxyStory
    }
  } catch {
    // Fallback keeps the reward flow available when AI is not configured.
  }

  return buildFallbackStory({
    topicId: input.topicId,
    words: input.words,
  })
}

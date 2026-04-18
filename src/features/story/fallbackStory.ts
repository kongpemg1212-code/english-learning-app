import type { StoryPayload } from '../../types/story'
import type { WordItem } from '../../types/word'

function pickWords(words: WordItem[], count: number) {
  return words.slice(0, count)
}

export function buildFallbackStory({
  topicId,
  words,
}: {
  topicId: string
  words: WordItem[]
}): StoryPayload {
  const storyWords = pickWords(words, 4)
  const first = storyWords[0]
  const second = storyWords[1]
  const third = storyWords[2]

  const title = first ? `A Little ${first.word} Story` : 'A Little English Story'

  return {
    title,
    topicId,
    generatedAt: new Date().toISOString(),
    sentences: [
      {
        text: first ? `Maya sees a ${first.word}.` : 'Maya sees something new.',
        zh: first ? `Maya 看见一个${first.meaningZh}。` : 'Maya 看见了新东西。',
        newWords: [],
      },
      {
        text: second ? `The ${second.word} is happy.` : 'It is happy.',
        zh: second ? `这个${second.meaningZh}很开心。` : '它很开心。',
        newWords: second
          ? [
              {
                word: 'happy',
                meaningZh: '开心的',
              },
            ]
          : [],
      },
      {
        text: third ? `Maya says, "Hello, ${third.word}!"` : 'Maya says, "Hello!"',
        zh: third ? `Maya 说：“你好，${third.meaningZh}！”` : 'Maya 说：“你好！”',
        newWords: [],
      },
      {
        text: 'They learn and smile together.',
        zh: '他们一起学习，一起微笑。',
        newWords: [
          {
            word: 'together',
            meaningZh: '一起',
          },
        ],
      },
    ],
    questions: [
      {
        question: first ? `What does Maya see?` : 'Who is in the story?',
        choices: first ? [first.word, 'moon', 'car'] : ['Maya', 'Dad', 'Cat'],
        answer: first?.word ?? 'Maya',
      },
    ],
  }
}

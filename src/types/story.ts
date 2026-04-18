export type StoryNewWord = {
  word: string
  meaningZh: string
}

export type StorySentence = {
  text: string
  zh: string
  newWords: StoryNewWord[]
}

export type StoryQuestion = {
  question: string
  choices: string[]
  answer: string
}

export type StoryPayload = {
  title: string
  topicId: string
  sentences: StorySentence[]
  questions: StoryQuestion[]
  generatedAt: string
}

export type StoryChatMessage = {
  messageId: string
  role: 'child' | 'assistant'
  content: string
  createdAt: string
}

export type PackSource = 'yle-core' | 'textbook' | 'custom-import'
export type WordLevel = 'preA1' | 'A1'

export type TopicMeta = {
  id: string
  title: string
  titleZh: string
  order: number
  coverImage?: string
  icon?: string
}

export type WordItem = {
  id: string
  word: string
  normalizedWord: string
  meaningZh: string
  phonics?: string
  ipa?: string
  image?: string
  audio?: string
  example?: string
  exampleZh?: string
  topic: string
  tags: string[]
  level: WordLevel
  source: PackSource
  unit?: string
  sortOrder?: number
}

export type WordPackMeta = {
  id: string
  name: string
  version: string
  source: PackSource
  locale: 'en-US'
  targetLocale: 'zh-CN'
  level: WordLevel
  description?: string
}

export type WordPack = {
  meta: WordPackMeta
  topics: TopicMeta[]
  words: WordItem[]
}

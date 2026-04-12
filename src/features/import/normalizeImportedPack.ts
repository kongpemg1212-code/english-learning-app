import type { TopicMeta, WordItem, WordPack } from '../../types/word'

type ImportedRow = {
  word: string
  meaningZh: string
  unit?: string
  topic?: string
  image?: string
  audio?: string
  example?: string
  exampleZh?: string
}

type NormalizeImportedPackInput = {
  name: string
  rows: ImportedRow[]
}

function normalizeWord(word: string) {
  return word.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function normalizeImportedPack({
  name,
  rows,
}: NormalizeImportedPackInput): WordPack {
  const words: WordItem[] = rows.map((row, index) => {
    const normalizedWord = normalizeWord(row.word)
    const topic = row.topic?.trim() || row.unit?.trim() || 'custom'

    return {
      id: `textbook-${topic.toLowerCase().replace(/\s+/g, '-')}-${normalizedWord.replace(/\s+/g, '-')}`,
      word: row.word.trim(),
      normalizedWord,
      meaningZh: row.meaningZh.trim(),
      image: row.image,
      audio: row.audio,
      example: row.example,
      exampleZh: row.exampleZh,
      topic,
      tags: [topic.toLowerCase()],
      level: 'preA1',
      source: 'textbook',
      unit: row.unit,
      sortOrder: index + 1,
    }
  })

  const topicMap = new Map<string, TopicMeta>()
  words.forEach((word, index) => {
    if (!topicMap.has(word.topic)) {
      topicMap.set(word.topic, {
        id: word.topic.toLowerCase().replace(/\s+/g, '-'),
        title: word.topic,
        titleZh: word.topic,
        order: index + 1,
      })
    }
  })

  return {
    meta: {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-pack`,
      name,
      version: '1.0.0',
      source: 'textbook',
      locale: 'en-US',
      targetLocale: 'zh-CN',
      level: 'preA1',
      description: `${name} 导入词包`,
    },
    topics: [...topicMap.values()],
    words,
  }
}

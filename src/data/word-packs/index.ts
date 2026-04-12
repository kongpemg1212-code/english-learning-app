import packData from './yle-core/pack.json'
import allWords from './yle-core/all-words.json'

import type { TopicMeta, WordItem, WordPack, WordPackMeta } from '../../types/word'

export const defaultWordPack: WordPack = {
  meta: packData.meta as WordPackMeta,
  topics: packData.topics as TopicMeta[],
  words: allWords as WordItem[],
}

export async function loadDefaultPack(): Promise<WordPack> {
  return defaultWordPack
}

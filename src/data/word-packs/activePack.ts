import type { WordPack } from '../../types/word'

import { defaultWordPack } from './index'

export function getActiveWordPack(importedPacks: WordPack[], selectedPackId?: string) {
  if (selectedPackId) {
    const imported = importedPacks.find((pack) => pack.meta.id === selectedPackId)
    if (imported) {
      return imported
    }
  }

  return defaultWordPack
}

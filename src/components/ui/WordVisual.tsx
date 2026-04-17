import { useState } from 'react'

import type { WordItem } from '../../types/word'

import { getBuiltInIllustration } from './builtInIllustrations'
import { getBuiltInVisualToken } from './wordVisualMap'

type WordVisualProps = {
  word: WordItem
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: { box: 72, font: '2rem' },
  md: { box: 108, font: '3rem' },
  lg: { box: 160, font: '4rem' },
} as const

export function WordVisual({ word, size = 'md' }: WordVisualProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const config = sizeMap[size]
  const builtInIllustration = getBuiltInIllustration(word, size)
  const emoji = getBuiltInVisualToken(word) ?? '✨'

  return (
    <div
      role="img"
      aria-label={word.word}
      style={{
        width: `${config.box}px`,
        height: `${config.box}px`,
        borderRadius: 'var(--radius-lg)',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,246,237,0.92))',
        border: '1px solid var(--color-surface-border)',
        display: 'grid',
        placeItems: 'center',
        fontSize: config.font,
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      {word.image && !imageFailed ? (
        <img
          src={word.image}
          alt=""
          aria-hidden="true"
          onError={() => setImageFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '10%',
          }}
        />
      ) : builtInIllustration ? (
        builtInIllustration
      ) : (
        emoji
      )}
    </div>
  )
}

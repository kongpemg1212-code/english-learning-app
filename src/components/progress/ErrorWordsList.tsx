type ErrorWordsListProps = {
  words: string[]
}

export function ErrorWordsList({ words }: ErrorWordsListProps) {
  return (
    <section style={{ display: 'grid', gap: '12px' }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>常错词</h2>
      {words.length === 0 ? (
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>目前还没有常错词，继续保持。</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {words.map((word) => (
            <span
              key={word}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 179, 71, 0.2)',
                color: '#7c4a08',
                fontWeight: 700,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}

type ProgressSummaryProps = {
  learnedCount: number
  totalCount: number
}

export function ProgressSummary({ learnedCount, totalCount }: ProgressSummaryProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '8px',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid var(--color-surface-border)',
      }}
    >
      <strong style={{ fontSize: '1.2rem' }}>
        已认识 {learnedCount} / {totalCount} 个词
      </strong>
      <div
        aria-hidden="true"
        style={{
          height: '12px',
          overflow: 'hidden',
          borderRadius: '999px',
          background: 'rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: `${totalCount === 0 ? 0 : Math.round((learnedCount / totalCount) * 100)}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
          }}
        />
      </div>
    </div>
  )
}

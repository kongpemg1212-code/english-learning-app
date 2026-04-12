type StreakPanelProps = {
  value: number
}

export function StreakPanel({ value }: StreakPanelProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '4px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 179, 71, 0.22)',
        textAlign: 'center',
      }}
    >
      <strong style={{ fontSize: '1.5rem' }}>🔥 {value}</strong>
      <span style={{ color: 'var(--color-text-light)' }}>连续学习</span>
    </div>
  )
}

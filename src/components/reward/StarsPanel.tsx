type StarsPanelProps = {
  value: number
}

export function StarsPanel({ value }: StarsPanelProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '4px',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(255, 230, 109, 0.28)',
        textAlign: 'center',
      }}
    >
      <strong style={{ fontSize: '1.5rem' }}>⭐ {value}</strong>
      <span style={{ color: 'var(--color-text-light)' }}>总星星</span>
    </div>
  )
}

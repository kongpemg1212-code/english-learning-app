type ComboMeterProps = {
  value: number
}

export function ComboMeter({ value }: ComboMeterProps) {
  if (value < 2) {
    return null
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40px',
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        background: 'rgba(255, 230, 109, 0.28)',
        color: '#6e5a00',
        fontWeight: 800,
      }}
    >
      {value} 连击
    </div>
  )
}

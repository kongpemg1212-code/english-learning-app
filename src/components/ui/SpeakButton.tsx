import type { ButtonHTMLAttributes } from 'react'

type SpeakButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string
}

export function SpeakButton({ label = '听一听', style, ...props }: SpeakButtonProps) {
  return (
    <button
      {...props}
      type="button"
      style={{
        minHeight: '40px',
        padding: '0 14px',
        borderRadius: '999px',
        border: '1px solid rgba(255, 107, 107, 0.22)',
        background: 'rgba(255,255,255,0.88)',
        color: 'var(--color-text)',
        fontSize: '0.95rem',
        fontWeight: 800,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span aria-hidden="true">🔊</span>
      <span>{label}</span>
    </button>
  )
}

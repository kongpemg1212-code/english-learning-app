import type { CSSProperties, PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<{
  style?: CSSProperties
}>

export function Card({ children, style }: CardProps) {
  return (
    <section
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        boxShadow: 'var(--shadow-card)',
        backdropFilter: 'blur(14px)',
        ...style,
      }}
    >
      {children}
    </section>
  )
}

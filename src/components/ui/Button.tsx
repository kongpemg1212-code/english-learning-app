import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
  }
>

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #ff6b6b, #ff8e53)',
    color: '#ffffff',
    boxShadow: 'var(--shadow-button)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #4ecdc4, #7de0d5)',
    color: '#17423f',
    boxShadow: '0 18px 32px -22px rgba(78, 205, 196, 0.5)',
  },
  ghost: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: 'var(--color-text)',
    boxShadow: 'none',
  },
}

export function Button({
  children,
  className = '',
  style,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={['touch-target-lg', 'animate-pop', className].filter(Boolean).join(' ')}
      style={{
        width: '100%',
        border: 'none',
        borderRadius: 'var(--radius-pill)',
        padding: '0 clamp(14px, 3vw, 24px)',
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(1rem, 2.8vw, 1.1rem)',
        fontWeight: 800,
        cursor: 'pointer',
        transition: 'transform 180ms ease, filter 180ms ease',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

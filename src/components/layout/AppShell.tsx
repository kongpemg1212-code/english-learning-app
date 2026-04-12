import type { PropsWithChildren } from 'react'

import type { AppRoute } from '../../routes'

const navItems: { route: AppRoute; label: string }[] = [
  { route: 'today', label: '今日' },
  { route: 'map', label: '地图' },
  { route: 'garden', label: '花园' },
  { route: 'progress', label: '进度' },
]

type AppShellProps = PropsWithChildren<{
  currentRoute: AppRoute
  onNavigate: (route: AppRoute) => void
  signedInEmail?: string
  currentPackName?: string
  onSignOut?: () => void
}>

export function AppShell({
  children,
  currentRoute,
  onNavigate,
  signedInEmail,
  currentPackName,
  onSignOut,
}: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '92px' }}>
      <div style={{ width: 'min(960px, calc(100% - 24px))', margin: '0 auto', paddingTop: '12px' }}>
        {signedInEmail ? (
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '14px 16px',
              marginBottom: '12px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255,255,255,0.82)',
              border: '1px solid var(--color-surface-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'grid', gap: '2px' }}>
              <strong>{signedInEmail}</strong>
              {currentPackName ? (
                <span style={{ color: 'var(--color-text-light)' }}>当前词库：{currentPackName}</span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onSignOut}
              style={{
                minHeight: '40px',
                padding: '0 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-surface-border)',
                background: 'rgba(255,255,255,0.92)',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              退出登录
            </button>
          </header>
        ) : null}
        {children}
      </div>

      <nav
        style={{
          position: 'fixed',
          left: '50%',
          bottom: '12px',
          transform: 'translateX(-50%)',
          width: 'min(720px, calc(100% - 24px))',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          padding: '10px',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.9)',
          boxShadow: 'var(--shadow-card)',
          backdropFilter: 'blur(14px)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.route}
            type="button"
            onClick={() => onNavigate(item.route)}
            style={{
              minHeight: '56px',
              display: 'grid',
              placeItems: 'center',
              borderRadius: '20px',
              border: 'none',
              color: currentRoute === item.route ? '#ffffff' : 'var(--color-text)',
              background:
                currentRoute === item.route
                  ? 'linear-gradient(135deg, #ff6b6b, #ff8e53)'
                  : 'transparent',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

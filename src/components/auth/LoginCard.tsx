import { useState } from 'react'

import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type LoginCardProps = {
  configured: boolean
  onContinue: () => Promise<unknown>
}

function getFriendlyError(message: string) {
  const lower = message.toLowerCase()

  if (lower.includes('anonymous sign-ins are disabled')) {
    return '匿名登录还没有在 Supabase 里打开。去 Supabase 后台的 Authentication > Sign In / Providers，把 Anonymous 打开就可以了。'
  }

  if (lower.includes('not configured')) {
    return '当前还没有连上云端，请先补好 Supabase 配置。'
  }

  return message
}

export function LoginCard({ configured, onContinue }: LoginCardProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!configured) {
      setMessage('当前还没有连上云端，请先补好 Supabase 配置。')
      return
    }

    try {
      setLoading(true)
      setMessage(null)
      await onContinue()
      setMessage('正在连接云端存档…')
    } catch (error) {
      const text = error instanceof Error ? error.message : '连接云端存档失败。'
      setMessage(getFriendlyError(text))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '520px', display: 'grid', gap: '16px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>云端存档</p>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>开启云端存档</h1>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          不用密码，也不用邮件确认。点一下就会为这台设备建立一个云端档案，并自动继续保存学习历史。
        </p>
        <Button onClick={() => void handleContinue()} disabled={loading}>
          {loading ? '正在连接云端存档…' : '一键进入并保存进度'}
        </Button>
        {message ? <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{message}</p> : null}
        {!configured ? (
          <p style={{ margin: 0, color: '#b25b00' }}>
            需要配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 后，云端存档才会真正生效。
          </p>
        ) : null}
      </Card>
    </main>
  )
}

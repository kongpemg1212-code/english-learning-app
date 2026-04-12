import { useState } from 'react'

import { sendMagicLink } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type LoginCardProps = {
  configured: boolean
}

export function LoginCard({ configured }: LoginCardProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  async function handleSend() {
    if (!configured) {
      setMessage('还没有配置 Supabase，暂时无法发送登录链接。')
      return
    }

    if (!email.trim()) {
      setMessage('请先输入邮箱。')
      return
    }

    try {
      await sendMagicLink(email.trim())
      setMessage('登录链接已经发送到邮箱，请点击邮件继续登录。如果刚更新过页面，请先刷新一次再重试。')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '发送登录链接失败。')
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <Card style={{ width: '100%', maxWidth: '520px', display: 'grid', gap: '16px' }}>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>账号登录</p>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>继续孩子的学习进度</h1>
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>
          使用邮箱免密码登录，之后会自动记住账号和学习进度。
        </p>
        <label style={{ fontWeight: 700 }}>
          邮箱
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            style={{
              width: '100%',
              marginTop: '6px',
              minHeight: '44px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-surface-border)',
              padding: '0 12px',
            }}
          />
        </label>
        <Button onClick={() => void handleSend()}>发送免密码登录链接</Button>
        {message ? <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{message}</p> : null}
        {!configured ? (
          <p style={{ margin: 0, color: '#b25b00' }}>
            需要配置 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 后，这个登录框才会真正生效。
          </p>
        ) : null}
      </Card>
    </main>
  )
}

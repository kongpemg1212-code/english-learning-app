import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

vi.mock('../../lib/supabase', () => ({
  sendMagicLink: vi.fn(async () => {
    throw new Error('email rate limit exceeded')
  }),
}))

import { LoginCard } from './LoginCard'

test('shows a friendly cooldown message when Supabase rate limits email sending', async () => {
  const user = userEvent.setup()

  render(<LoginCard configured />)
  await user.type(screen.getByLabelText('邮箱'), 'kid@example.com')
  await user.click(screen.getByRole('button', { name: '发送免密码登录链接' }))

  expect(screen.getByText(/发送太频繁/)).toBeInTheDocument()
  expect(screen.getByRole('button')).toBeDisabled()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { LoginCard } from './LoginCard'

test('starts the cloud archive flow from a single button', async () => {
  const user = userEvent.setup()
  const onContinue = vi.fn(async () => {})

  render(<LoginCard configured onContinue={onContinue} />)
  await user.click(screen.getByRole('button', { name: '一键进入并保存进度' }))

  expect(onContinue).toHaveBeenCalled()
})

test('shows a clearer hint when anonymous sign-ins are disabled on Supabase', async () => {
  const user = userEvent.setup()
  const onContinue = vi.fn(async () => {
    throw new Error('Anonymous sign-ins are disabled')
  })

  render(<LoginCard configured onContinue={onContinue} />)
  await user.click(screen.getByRole('button', { name: '一键进入并保存进度' }))

  expect(screen.getByText(/匿名登录还没有在 Supabase 里打开/)).toBeInTheDocument()
})

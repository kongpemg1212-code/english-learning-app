import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { AppShell } from './AppShell'

test('shows a signed-in status bar with email, current pack, and sign-out action', async () => {
  const user = userEvent.setup()
  const onSignOut = vi.fn()

  render(
    <AppShell
      currentRoute="today"
      onNavigate={() => {}}
      signedInEmail="kid@example.com"
      currentPackName="YLE Core Pack"
      onSignOut={onSignOut}
    >
      <div>content</div>
    </AppShell>,
  )

  expect(screen.getByText('kid@example.com')).toBeInTheDocument()
  expect(screen.getByText(/当前词库：YLE Core Pack/)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '退出登录' }))
  expect(onSignOut).toHaveBeenCalled()
})

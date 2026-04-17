import { render, screen } from '@testing-library/react'

import { AppShell } from './AppShell'

test('shows a cloud archive status bar with profile label and current pack', async () => {
  render(
    <AppShell
      currentRoute="today"
      onNavigate={() => {}}
      profileLabel="账号：maya"
      currentPackName="YLE Core Pack"
    >
      <div>content</div>
    </AppShell>,
  )

  expect(screen.getByText('账号：maya')).toBeInTheDocument()
  expect(screen.getByText(/当前词库：YLE Core Pack/)).toBeInTheDocument()
  expect(screen.getByText('本机 SQLite 保存')).toBeInTheDocument()
})

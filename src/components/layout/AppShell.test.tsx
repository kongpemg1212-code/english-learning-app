import { render, screen } from '@testing-library/react'

import { AppShell } from './AppShell'

test('shows a cloud archive status bar with profile label and current pack', async () => {
  render(
    <AppShell
      currentRoute="today"
      onNavigate={() => {}}
      profileLabel="云端存档：AB12CD34"
      currentPackName="YLE Core Pack"
    >
      <div>content</div>
    </AppShell>,
  )

  expect(screen.getByText('云端存档：AB12CD34')).toBeInTheDocument()
  expect(screen.getByText(/当前词库：YLE Core Pack/)).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

vi.mock('./features/profile/useLocalProfileSync', () => ({
  useLocalProfileSync: () => ({
    profileId: 'maya',
    synced: true,
  }),
}))

vi.mock('./pages/TodayPage', () => ({
  TodayPage: () => <div>today-page</div>,
}))

vi.mock('./pages/StoryPage', () => ({
  StoryPage: () => <div>story-page</div>,
}))

import App from './App'

test('shows entry choices before entering the app', () => {
  render(<App />)

  expect(screen.getByText('先选一种进入方式')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '临时开始' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '继续学习' })).toBeInTheDocument()
})

test('enters the app after choosing a named profile', async () => {
  const user = userEvent.setup()

  render(<App />)
  await user.click(screen.getByRole('button', { name: '继续学习' }))

  expect(screen.getByText('today-page')).toBeInTheDocument()
})

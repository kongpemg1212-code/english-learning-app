import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('./features/profile/useLocalProfileSync', () => ({
  useLocalProfileSync: () => ({
    profileId: 'maya',
    synced: true,
  }),
}))

import App from './App'

test('renders the today mission instead of a login gate', () => {
  render(<App />)

  expect(screen.getByText('一起开始今天的英语冒险')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '开始今天的冒险' })).toBeInTheDocument()
})

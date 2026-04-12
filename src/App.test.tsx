import { render, screen } from '@testing-library/react'

import App from './App'

test('renders the simple cloud archive entry when auth is not configured', () => {
  render(<App />)

  expect(screen.getByText('开启云端存档')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '一键进入并保存进度' })).toBeInTheDocument()
})

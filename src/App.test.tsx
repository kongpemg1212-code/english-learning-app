import { render, screen } from '@testing-library/react'

import App from './App'

test('renders the passwordless login entry when auth is not configured', () => {
  render(<App />)

  expect(screen.getByText('继续孩子的学习进度')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '发送免密码登录链接' })).toBeInTheDocument()
})

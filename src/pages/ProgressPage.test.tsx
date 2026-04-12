import { render, screen } from '@testing-library/react'

import { ProgressPage } from './ProgressPage'

test('shows streak, learned words, and common mistakes', () => {
  render(<ProgressPage />)

  expect(screen.getByText('连续学习')).toBeInTheDocument()
  expect(screen.getByText('常错词')).toBeInTheDocument()
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TodayPage } from './TodayPage'

test("starts from today's mission and advances into the lesson flow", async () => {
  const user = userEvent.setup()

  render(<TodayPage onNavigate={() => {}} />)
  await waitFor(() => {
    expect(screen.getByRole('button', { name: '开始今天的冒险' })).not.toBeDisabled()
  })
  await user.click(screen.getByRole('button', { name: '开始今天的冒险' }))

  expect(screen.getByText('发现新朋友')).toBeInTheDocument()
})

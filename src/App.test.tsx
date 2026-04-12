import { render, screen } from '@testing-library/react'

import App from './App'

test("renders the daily mission entry point", () => {
  render(<App />)

  expect(screen.getByText('开始今天的冒险')).toBeInTheDocument()
})

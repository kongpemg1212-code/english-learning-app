import { render, screen } from '@testing-library/react'

import { Button } from './Button'

test('renders the primary button with a touch-friendly target size', () => {
  render(<Button>开始今天的冒险</Button>)

  expect(screen.getByRole('button')).toHaveClass('touch-target-lg')
})

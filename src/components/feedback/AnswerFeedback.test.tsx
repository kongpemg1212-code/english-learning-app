import { render, screen } from '@testing-library/react'

import { AnswerFeedback } from './AnswerFeedback'

test('shows a gentle success state with celebratory copy', () => {
  render(<AnswerFeedback state="correct" message="太棒了！" />)

  expect(screen.getByText('太棒了！')).toBeInTheDocument()
})

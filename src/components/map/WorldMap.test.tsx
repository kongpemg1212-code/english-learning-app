import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { WorldMap } from './WorldMap'

test('allows clicking an unlocked topic and reports the selected topic', async () => {
  const user = userEvent.setup()
  const onSelectTopic = vi.fn()

  render(
    <WorldMap
      topics={[
        { id: 'animals', label: '动物' },
        { id: 'school', label: '学校' },
      ]}
      currentTopicId="school"
      onSelectTopic={onSelectTopic}
    />,
  )
  await user.click(screen.getByRole('button', { name: /动物/i }))

  expect(onSelectTopic).toHaveBeenCalledWith('animals')
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import { GardenPage } from './GardenPage'
import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({
    totalStars: 0,
    currentStreak: 0,
    lastCompletedDate: undefined,
    gardenStage: 0,
    selectedPlant: 'sunflower',
    selectedTopicId: 'school',
    soundEnabled: true,
  })
})

test('locks advanced plants until their conditions are met', () => {
  render(<GardenPage onNavigate={() => {}} />)

  expect(screen.getByText('需要 10 颗星星')).toBeInTheDocument()
  expect(screen.getByText('需要连续学习 3 天')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '选草莓' })).toBeDisabled()
  expect(screen.getByRole('button', { name: '选郁金香' })).toBeDisabled()
})

test('lets the child choose an unlocked plant and continue back to today', async () => {
  const user = userEvent.setup()
  const onNavigate = vi.fn()
  useAppStore.setState({
    totalStars: 12,
    currentStreak: 4,
    selectedPlant: 'sunflower',
  })

  render(<GardenPage onNavigate={onNavigate} />)
  await user.click(screen.getByRole('button', { name: '选草莓' }))

  expect(screen.getByText('已经种下草莓')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: '回到今日任务' }))
  expect(onNavigate).toHaveBeenCalledWith('today')
})

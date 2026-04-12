import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { useAppStore } from '../store/useAppStore'

import { ParentPage } from './ParentPage'

beforeEach(() => {
  useAppStore.setState({
    totalStars: 0,
    currentStreak: 0,
    lastCompletedDate: undefined,
    gardenStage: 0,
    selectedPlant: 'sunflower',
    selectedTopicId: 'school',
    selectedPackId: undefined,
    importedPacks: [],
    soundEnabled: true,
  })
})

test('imports a csv word pack and switches to it', async () => {
  const user = userEvent.setup()

  render(<ParentPage />)

  await user.clear(screen.getByLabelText('词包名称'))
  await user.type(screen.getByLabelText('词包名称'), '51Talk Unit 1')
  await user.clear(screen.getByLabelText('粘贴 CSV 词表'))
  await user.type(
    screen.getByLabelText('粘贴 CSV 词表'),
    'word,meaningZh,topic,example,exampleZh{enter}cat,猫,animals,This is a cat.,这是一只猫。',
  )
  await user.click(screen.getByRole('button', { name: '导入词表并切换' }))

  expect(screen.getByText(/已导入 1 个词/)).toBeInTheDocument()
  expect(useAppStore.getState().importedPacks).toHaveLength(1)
})

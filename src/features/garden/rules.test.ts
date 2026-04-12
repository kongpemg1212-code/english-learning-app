import {
  STRAWBERRY_UNLOCK_STARS,
  TULIP_UNLOCK_STREAK,
  getPlantUnlockText,
  isPlantUnlocked,
} from './rules'

test('sunflower is unlocked by default', () => {
  expect(isPlantUnlocked('sunflower', { totalStars: 0, currentStreak: 0 })).toBe(true)
})

test('strawberry needs enough stars', () => {
  expect(isPlantUnlocked('strawberry', { totalStars: STRAWBERRY_UNLOCK_STARS - 1, currentStreak: 0 })).toBe(false)
  expect(isPlantUnlocked('strawberry', { totalStars: STRAWBERRY_UNLOCK_STARS, currentStreak: 0 })).toBe(true)
})

test('tulip needs enough streak days', () => {
  expect(isPlantUnlocked('tulip', { totalStars: 100, currentStreak: TULIP_UNLOCK_STREAK - 1 })).toBe(false)
  expect(getPlantUnlockText('tulip', { totalStars: 0, currentStreak: 0 })).toContain(`${TULIP_UNLOCK_STREAK}`)
})

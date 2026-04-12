export type GardenPlant = 'sunflower' | 'strawberry' | 'tulip'

export const STRAWBERRY_UNLOCK_STARS = 10
export const TULIP_UNLOCK_STREAK = 3

export function isPlantUnlocked(
  plant: GardenPlant,
  stats: { totalStars: number; currentStreak: number },
) {
  if (plant === 'sunflower') {
    return true
  }

  if (plant === 'strawberry') {
    return stats.totalStars >= STRAWBERRY_UNLOCK_STARS
  }

  return stats.currentStreak >= TULIP_UNLOCK_STREAK
}

export function getPlantUnlockText(
  plant: GardenPlant,
  stats: { totalStars: number; currentStreak: number },
) {
  if (isPlantUnlocked(plant, stats)) {
    return '已解锁'
  }

  if (plant === 'strawberry') {
    return `需要 ${STRAWBERRY_UNLOCK_STARS} 颗星星`
  }

  return `需要连续学习 ${TULIP_UNLOCK_STREAK} 天`
}

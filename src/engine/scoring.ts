export function calculateMissionStars(correctAnswers: number) {
  return Math.max(5, correctAnswers * 3)
}

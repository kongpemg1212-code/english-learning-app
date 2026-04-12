type GardenGrowthProps = {
  plant: string
  stage: number
}

const plantEmoji = {
  sunflower: ['🌱', '🌿', '🌼', '🌻', '🌻'],
  strawberry: ['🌱', '🍃', '🌸', '🍓', '🍓'],
  tulip: ['🌱', '🌿', '🌷', '🌷', '🌷'],
} as const

export function GardenGrowth({ plant, stage }: GardenGrowthProps) {
  const growth = plantEmoji[plant as keyof typeof plantEmoji] ?? plantEmoji.sunflower
  const safeStage = Math.max(0, Math.min(stage, growth.length - 1))

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        gap: '8px',
        padding: '20px',
        minHeight: '180px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(78, 205, 196, 0.15)',
      }}
    >
      <div style={{ fontSize: '4.4rem' }}>{growth[safeStage]}</div>
      <strong>成长阶段 {safeStage + 1}</strong>
    </div>
  )
}

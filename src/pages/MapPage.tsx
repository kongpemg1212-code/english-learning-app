import { Card } from '../components/ui/Card'
import { getActiveWordPack } from '../data/word-packs/activePack'
import { WorldMap } from '../components/map/WorldMap'
import { useAppStore } from '../store/useAppStore'

type MapPageProps = {
  onNavigate: (route: 'today' | 'map' | 'garden' | 'progress' | 'parent') => void
}

export function MapPage({ onNavigate }: MapPageProps) {
  const currentTopicId = useAppStore((state) => state.selectedTopicId)
  const chooseTopic = useAppStore((state) => state.chooseTopic)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const activePack = getActiveWordPack(importedPacks, selectedPackId)

  return (
    <main style={{ padding: '20px 0' }}>
      <Card style={{ display: 'grid', gap: '20px' }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: '8px' }}>
          <p style={{ margin: 0, color: 'var(--color-text-light)' }}>闯关地图</p>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>沿着彩虹小路继续前进</h1>
        </div>
        <WorldMap
          topics={activePack.topics.map((topic) => ({
            id: topic.id,
            label: topic.titleZh,
          }))}
          currentTopicId={currentTopicId}
          onSelectTopic={(topicId) => {
            chooseTopic(topicId)
            onNavigate('today')
          }}
        />
      </Card>
    </main>
  )
}

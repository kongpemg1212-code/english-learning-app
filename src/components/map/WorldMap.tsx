type MapTopic = {
  id: string
  label: string
}

type WorldMapProps = {
  topics: MapTopic[]
  currentTopicId: string
  onSelectTopic: (topicId: string) => void
}

export function WorldMap({ topics, currentTopicId, onSelectTopic }: WorldMapProps) {
  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      {topics.map((topic, index) => {
        const active = topic.id === currentTopicId
        const background = active
          ? 'linear-gradient(135deg, rgba(78,205,196,0.28), rgba(255,230,109,0.28))'
          : 'rgba(255, 107, 107, 0.16)'

        return (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.id)}
            style={{
              width: index % 2 === 0 ? '78%' : '78%',
              marginLeft: index % 2 === 0 ? 0 : 'auto',
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              background,
              border: '1px solid var(--color-surface-border)',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <strong>{topic.label}</strong>
            <p style={{ margin: '6px 0 0', color: 'var(--color-text-light)' }}>
              {active ? '✨ 当前主题' : '点击开始学习'}
            </p>
          </button>
        )
      })}
    </div>
  )
}

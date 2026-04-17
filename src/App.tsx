import { useEffect, useState } from 'react'

import { AppShell } from './components/layout/AppShell'
import { getActiveWordPack } from './data/word-packs/activePack'
import { useLocalProfileSync } from './features/profile/useLocalProfileSync'
import { EntryPage } from './pages/EntryPage'
import { GardenPage } from './pages/GardenPage'
import { MapPage } from './pages/MapPage'
import { ParentPage } from './pages/ParentPage'
import { ProgressPage } from './pages/ProgressPage'
import { TodayPage } from './pages/TodayPage'
import { getRouteFromHash, navigateToRoute, type AppRoute } from './routes'
import { useAppStore } from './store/useAppStore'

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())
  const [hasEntered, setHasEntered] = useState(false)
  const profile = useLocalProfileSync()
  const setCloudProfileId = useAppStore((state) => state.setCloudProfileId)
  const importedPacks = useAppStore((state) => state.importedPacks)
  const selectedPackId = useAppStore((state) => state.selectedPackId)
  const activePack = getActiveWordPack(importedPacks, selectedPackId)

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash())
    window.addEventListener('hashchange', onHashChange)

    if (!window.location.hash) {
      navigateToRoute('today')
    }

    return () => {
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  if (!hasEntered) {
    return (
      <EntryPage
        lastProfileId={profile.profileId}
        onChooseTemporary={(profileId) => {
          setCloudProfileId(profileId)
          setHasEntered(true)
        }}
        onChooseNamed={(profileId) => {
          setCloudProfileId(profileId)
          setHasEntered(true)
        }}
      />
    )
  }

  let content = <TodayPage onNavigate={navigateToRoute} />

  if (route === 'map') {
    content = <MapPage onNavigate={navigateToRoute} />
  } else if (route === 'garden') {
    content = <GardenPage onNavigate={navigateToRoute} />
  } else if (route === 'progress') {
    content = <ProgressPage />
  } else if (route === 'parent') {
    content = <ParentPage />
  }

  const profileLabel = profile.profileId ? `账号：${profile.profileId}` : '账号：本机'

  return (
    <AppShell
      currentRoute={route}
      onNavigate={navigateToRoute}
      profileLabel={profileLabel}
      currentPackName={activePack.meta.name}
    >
      {content}
    </AppShell>
  )
}

export default App

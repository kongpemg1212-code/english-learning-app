import { useEffect, useState } from 'react'

import { AppShell } from './components/layout/AppShell'
import { getActiveWordPack } from './data/word-packs/activePack'
import { useCloudProfileSync } from './features/profile/useCloudProfileSync'
import { GardenPage } from './pages/GardenPage'
import { MapPage } from './pages/MapPage'
import { ParentPage } from './pages/ParentPage'
import { ProgressPage } from './pages/ProgressPage'
import { TodayPage } from './pages/TodayPage'
import { getRouteFromHash, navigateToRoute, type AppRoute } from './routes'
import { useAppStore } from './store/useAppStore'

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())
  const profile = useCloudProfileSync()
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

  const profileLabel = profile.profileId ? `账号：${profile.profileId}` : '账号：仅本机'

  return (
    <AppShell
      currentRoute={route}
      onNavigate={navigateToRoute}
      profileLabel={profileLabel}
      currentPackName={activePack.meta.name}
      cloudEnabled={profile.cloudEnabled}
    >
      {content}
    </AppShell>
  )
}

export default App

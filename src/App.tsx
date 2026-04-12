import { useEffect, useState } from 'react'

import { AppShell } from './components/layout/AppShell'
import { LoginCard } from './components/auth/LoginCard'
import { getActiveWordPack } from './data/word-packs/activePack'
import { useAuthState } from './features/auth/useAuthState'
import { GardenPage } from './pages/GardenPage'
import { MapPage } from './pages/MapPage'
import { ParentPage } from './pages/ParentPage'
import { ProgressPage } from './pages/ProgressPage'
import { TodayPage } from './pages/TodayPage'
import { getRouteFromHash, navigateToRoute, type AppRoute } from './routes'
import { useAppStore } from './store/useAppStore'

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())
  const auth = useAuthState()
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

  if (auth.loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        正在恢复登录状态…
      </main>
    )
  }

  if (!auth.user) {
    return <LoginCard configured={auth.available} />
  }

  return (
    <AppShell
      currentRoute={route}
      onNavigate={navigateToRoute}
      signedInEmail={auth.user?.email}
      currentPackName={activePack.meta.name}
      onSignOut={() => void auth.signOut()}
    >
      {content}
    </AppShell>
  )
}

export default App

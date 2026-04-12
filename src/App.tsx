import { useEffect, useState } from 'react'

import { AppShell } from './components/layout/AppShell'
import { GardenPage } from './pages/GardenPage'
import { MapPage } from './pages/MapPage'
import { ParentPage } from './pages/ParentPage'
import { ProgressPage } from './pages/ProgressPage'
import { TodayPage } from './pages/TodayPage'
import { getRouteFromHash, navigateToRoute, type AppRoute } from './routes'

function App() {
  const [route, setRoute] = useState<AppRoute>(() => getRouteFromHash())

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

  return <AppShell currentRoute={route} onNavigate={navigateToRoute}>{content}</AppShell>
}

export default App

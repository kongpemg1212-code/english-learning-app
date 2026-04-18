export type AppRoute = 'today' | 'map' | 'garden' | 'progress' | 'parent' | 'story'

const routeMap: Record<string, AppRoute> = {
  '/': 'today',
  '/today': 'today',
  '/map': 'map',
  '/garden': 'garden',
  '/progress': 'progress',
  '/parent': 'parent',
  '/story': 'story',
}

export function getRouteFromHash(hash = window.location.hash): AppRoute {
  const normalized = hash.replace(/^#/, '') || '/'
  return routeMap[normalized] ?? 'today'
}

export function navigateToRoute(route: AppRoute) {
  const target = route === 'today' ? '#/' : `#/${route}`
  window.location.hash = target
}

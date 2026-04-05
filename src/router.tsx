import { createRouter as createTanStackRouter } from '@tanstack/react-router'

import { getContext } from './lib/tanstack-query'
import { routeTree } from './routeTree.gen'

// eslint-disable-next-line react/only-export-components -- router config, not a component module
function NotFound() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </main>
  )
}

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: NotFound,

    context: getContext(),

    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
  // https://tanstack.com/router/latest/docs/framework/react/guide/static-route-data
  interface StaticDataRouteOption {
    title?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

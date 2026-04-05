import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'

import { AppHeader } from '#/components/layout/app-header'
import { AppSidebar } from '#/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar'
import { ToastProvider } from '#/components/ui/toast'
import { ReactI18nextProvider } from '#/lib/i18next'
import { TanstackDevtools } from '#/lib/tanstack-devtools'
import { TanStackQueryProvider } from '#/lib/tanstack-query'

import appCss from '../index.css?url'

interface RootRouteContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('theme');var t='system';if(raw){try{var p=JSON.parse(raw);if(p&&p.state)t=p.state.theme||'system'}catch(e){if(raw==='dark'||raw==='light')t=raw}}if(t!=='dark'&&t!=='light'&&t!=='system')t='system';var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var h=document.documentElement;h.classList.remove('light','dark');h.classList.add(r);h.style.colorScheme=r}catch(e){}})()`

export const Route = createRootRouteWithContext<RootRouteContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Web Dev Template' },
      {
        name: 'description',
        content: 'A modern web app built with React 19, TanStack Start, and Tailwind CSS.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="bg-background font-sans text-foreground antialiased">
        <TanStackQueryProvider>
          <ReactI18nextProvider>
            <ToastProvider>
              <SidebarProvider
                style={{
                  '--sidebar-width': 'calc(var(--spacing) * 56)',
                  '--header-height': 'calc(var(--spacing) * 12)',
                }}
              >
                <AppSidebar />
                <SidebarInset className="min-h-screen pt-2">
                  <AppHeader />
                  <main className="flex-1 pt-2">{children}</main>
                  <TanstackDevtools />
                </SidebarInset>
              </SidebarProvider>
            </ToastProvider>
          </ReactI18nextProvider>
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

import { AppHeader } from '#/components/layout/app-header';
import { AppSidebar } from '#/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar';
import { TanStackDevtools } from '#/lib/tanstack-devtools';

interface RootRouteContext {
  queryClient: QueryClient;
  isProtected?: boolean;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <SidebarProvider
      style={{
        '--sidebar-width': 'calc(var(--spacing) * 56)',
        '--header-height': 'calc(var(--spacing) * 12)',
      }}
    >
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <AppHeader />
        <Outlet />
        <TanStackDevtools />
      </SidebarInset>
    </SidebarProvider>
  ),
});

import { Link } from '@tanstack/react-router'
import { BadgeCheckIcon, BellIcon, CreditCardIcon, LogOutIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { authClient } from '#/lib/auth-client'

export function AppUserMenu() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return <div className="size-9 animate-pulse rounded-full bg-muted" />
  }

  if (!session?.user) {
    return (
      <Button
        nativeButton={false}
        size="sm"
        variant="outline"
        className="rounded-full"
        render={<Link to="/demo/auth" />}
      >
        Sign in
      </Button>
    )
  }

  const initials = session.user.name?.charAt(0).toUpperCase() ?? 'U'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button size="icon" className="rounded-full" title="User menu">
            <Avatar>
              {session.user.image && <AvatarImage src={session.user.image} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        }
      />
      <DropdownMenuContent align="end" side="top">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheckIcon />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              void authClient.signOut()
            }}
          >
            <LogOutIcon />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

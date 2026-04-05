import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { Button } from '#/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Spinner } from '#/components/ui/spinner'
import { authClient } from '#/lib/auth-client'

export const Route = createFileRoute('/demo/auth')({
  staticData: { title: 'Auth', icon: ShieldCheck },
  component: BetterAuthDemo,
})

function BetterAuthDemo() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner />
      </div>
    )
  }

  if (session?.user) {
    return <SignedInView session={session} />
  }

  return <AuthForm />
}

function SignedInView({
  session,
}: {
  session: { user: { name?: string | null; email: string; image?: string | null } }
}) {
  const initials = session.user.name?.charAt(0).toUpperCase() ?? 'U'

  return (
    <div className="container mx-auto flex max-w-sm justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>You&rsquo;re signed in as {session.user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar>
              {session.user.image && <AvatarImage src={session.user.image} alt="" />}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{session.user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              void authClient.signOut()
            }}
          >
            Sign out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({ email, password, name })
        if (result.error) setError(result.error.message ?? 'Sign up failed')
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) setError(result.error.message ?? 'Sign in failed')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex max-w-sm justify-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create an account' : 'Sign in'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your information to create an account'
              : 'Enter your credentials to sign in'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner className="mr-2" /> : null}
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            variant="link"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

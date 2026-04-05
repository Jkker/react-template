import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { Database } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { Separator } from '#/components/ui/separator'
import { db } from '#/db/index'
import { todos } from '#/db/schema'

const getTodos = createServerFn({
  method: 'GET',
}).handler(
  async () =>
    await db.query.todos.findMany({
      orderBy: [desc(todos.createdAt)],
    }),
)

const createTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { title: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(todos).values({ title: data.title })
    return { success: true }
  })

export const Route = createFileRoute('/demo/drizzle')({
  staticData: { title: 'Drizzle', icon: Database },
  component: DemoDrizzle,
  loader: async () => await getTodos(),
})

function DemoDrizzle() {
  const router = useRouter()
  const items = Route.useLoaderData()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    if (!title) return

    await createTodo({ data: { title } })
    void router.invalidate()
    e.currentTarget.reset()
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">Drizzle ORM</h1>
        <p className="text-muted-foreground">
          Type-safe SQL with SQLite — data persisted via server functions and loaded in the route
          loader.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Todos</CardTitle>
          <CardDescription>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input name="title" placeholder="What needs to be done?" className="flex-1" />
            <Button type="submit">Add</Button>
          </form>

          <Separator />

          {items.length > 0 ? (
            <ul className="divide-y">
              {items.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between py-3">
                  <span>{todo.title}</span>
                  <span className="text-xs text-muted-foreground">#{todo.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No todos yet. Create one above!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

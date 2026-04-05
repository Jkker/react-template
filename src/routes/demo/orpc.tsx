import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Plug } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Input } from '#/components/ui/input'
import { orpc } from '#/orpc/client'

export const Route = createFileRoute('/demo/orpc')({
  staticData: { title: 'oRPC', icon: Plug },
  component: OrpcTodoDemo,
})

function OrpcTodoDemo() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')

  const todosQuery = useQuery(orpc.listTodos.queryOptions({}))
  const addMutation = useMutation(
    orpc.addTodo.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.listTodos.key() })
        setTitle('')
      },
    }),
  )

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-bold">oRPC Todo</h1>
        <p className="text-muted-foreground">
          End-to-end type-safe RPC — server functions are called from the client via TanStack Query.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Todos</CardTitle>
          <CardDescription>Add and list todos via oRPC server handlers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!title.trim()) return
              addMutation.mutate({ name: title.trim() })
            }}
            className="flex gap-2"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new todo…"
              className="flex-1"
            />
            <Button type="submit" disabled={addMutation.isPending}>
              {addMutation.isPending ? 'Adding…' : 'Add'}
            </Button>
          </form>

          {todosQuery.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {todosQuery.data && todosQuery.data.length > 0 ? (
            <ul className="divide-y">
              {todosQuery.data.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between py-3">
                  <span>{todo.name}</span>
                  <span className="text-xs text-muted-foreground">#{todo.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            !todosQuery.isLoading && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No todos yet. Create one above!
              </p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}

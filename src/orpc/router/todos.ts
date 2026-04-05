import { os } from '@orpc/server'
import { type } from 'arktype'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

export const listTodos = os.handler(() => todos)

export const addTodo = os.input(type({ name: 'string' })).handler(({ input }) => {
  const newTodo = { id: todos.length + 1, name: input.name }
  todos.push(newTodo)
  return newTodo
})

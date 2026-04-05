import { createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react'

export const Route = createFileRoute('/about')({
  staticData: { title: 'About', icon: Info },
  component: About,
})

function About() {
  return (
    <article className="mx-auto prose max-w-3xl px-4 py-12 dark:prose-invert">
      <h1>A small starter with room to grow.</h1>
      <p>
        TanStack Start gives you type-safe routing, server functions, and modern SSR defaults. Use
        this as a clean foundation, then layer in your own routes, styling, and add-ons.
      </p>
      <h2>What's included</h2>
      <ul>
        <li>
          <strong>TanStack Router</strong> — file-based, type-safe routing with loaders &amp; search
          params
        </li>
        <li>
          <strong>TanStack Query</strong> — powerful async state management
        </li>
        <li>
          <strong>TanStack Form</strong> — headless forms with Arktype validation
        </li>
        <li>
          <strong>TanStack Table</strong> — headless table with sorting, filtering &amp; pagination
        </li>
        <li>
          <strong>oRPC</strong> — end-to-end type-safe RPC
        </li>
        <li>
          <strong>Drizzle ORM</strong> — type-safe SQL with SQLite
        </li>
        <li>
          <strong>Better Auth</strong> — email/password authentication
        </li>
        <li>
          <strong>Tailwind CSS 4</strong> — utility-first styling with the typography plugin
        </li>
        <li>
          <strong>Zustand</strong> — lightweight client state via zustand-x
        </li>
      </ul>
    </article>
  )
}

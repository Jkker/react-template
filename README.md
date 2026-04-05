# React 2026 Template — Fullstack

Modern React 19 fullstack starter with SSR via TanStack Start, server functions, oRPC, Drizzle ORM, Better Auth, and a unified dev toolchain.

> Looking for the client-only SPA variant? See the [`main` branch](https://github.com/Jkker/react-template/tree/main).

## Getting Started

```bash
# Install Vite+ (manages Node.js, pnpm, and the entire dev toolchain)
curl -fsSL https://vite.plus | bash

git clone -b fullstack https://github.com/Jkker/react-template
cd template-react

vp install
vp dev
```

The dev server uses `PORT` from `.env` (default `5173`). The `prepare` script runs `vp config` (Git hooks) and installs the Chromium binary for Playwright-backed browser tests.

### Database Setup

The template uses SQLite via Drizzle ORM. The database file is created automatically at `data/sqlite.db`.

```bash
vp run db:generate   # Generate migrations from src/db/schema.ts
vp run db:push       # Push schema directly to local dev DB
vp run db:studio     # Open Drizzle Studio GUI
```

## Fullstack vs SPA

| Feature          | `fullstack` (this branch)                 | [`main`](https://github.com/Jkker/react-template/tree/main) (SPA) |
| ---------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| Rendering        | SSR via TanStack Start                    | Client-side only (SPA)                                            |
| Server functions | `createServerFn` for data loaders/actions | None — client-only data fetching                                  |
| API layer        | oRPC (type-safe RPC via server handlers)  | External API via `fetch` / TanStack Query                         |
| Database         | Drizzle ORM + SQLite (better-sqlite3)     | None                                                              |
| Authentication   | Better Auth (email/password, sessions)    | None                                                              |
| HTML document    | Server-rendered `shellComponent` in root  | Static `index.html`                                               |
| Entry point      | `src/router.tsx` (Start manages entry)    | `src/main.tsx`                                                    |

## Tech Stack

| Category   | Technology                                                  |
| ---------- | ----------------------------------------------------------- |
| Core       | React 19 with React Compiler                                |
| Framework  | TanStack Start (SSR, server functions, streaming)           |
| Build      | Vite+ (Vite 8, Rolldown, Vitest, Oxlint, Oxfmt)             |
| Routing    | TanStack Router (file-based, type-safe, code-splitting)     |
| Data       | TanStack Query, TanStack Table                              |
| RPC        | oRPC (end-to-end type-safe server ↔ client calls)           |
| Forms      | TanStack Form + Arktype validation                          |
| Database   | Drizzle ORM + SQLite (better-sqlite3)                       |
| Auth       | Better Auth (email/password, TanStack Start cookies plugin) |
| State      | Zustand / Zustand X                                         |
| Validation | Arktype, ArkEnv, ArkRegex                                   |
| Styling    | Tailwind CSS 4, class-variance-authority, tailwind-merge    |
| UI         | shadcn/ui (base-nova), Base UI, Lucide                      |
| i18n       | i18next, react-i18next, http-backend, language detector     |
| Testing    | Vitest (via Vite+), vitest-browser-react, Playwright        |
| Docs       | Storybook 10                                                |
| Quality    | Vite+ (`vp check`), Knip, Commitlint                        |

## Project Structure

```text
.
├── data/                 # SQLite database file (git-ignored)
├── drizzle.config.ts     # Drizzle Kit config (dialect: sqlite)
├── public/
│   ├── locales/          # Translation resources loaded by i18next
│   └── robots.txt
├── scripts/              # Utility scripts and Docker CI images
├── src/
│   ├── components/
│   │   ├── examples/     # Demo feature components
│   │   ├── layout/       # App header, sidebar, user menu
│   │   └── ui/           # Reusable UI primitives (shadcn-derived)
│   ├── db/
│   │   ├── index.ts      # Drizzle client (better-sqlite3)
│   │   └── schema.ts     # Database schema (todos table)
│   ├── hooks/            # Shared React hooks (forms, clipboard, media query)
│   ├── lib/
│   │   ├── auth.ts       # Better Auth server config
│   │   ├── auth-client.ts # Better Auth React client
│   │   ├── i18next.tsx   # i18n setup and provider
│   │   ├── tanstack-devtools.tsx # Unified devtools (Router + Query + Form)
│   │   ├── tanstack-query.tsx    # QueryClient provider
│   │   └── ...           # Context helpers, regex, Temporal utils
│   ├── orpc/
│   │   ├── client.ts     # Isomorphic oRPC client (server/client split)
│   │   └── router/       # oRPC route handlers (todos)
│   ├── routes/
│   │   ├── __root.tsx    # App shell (SSR document, sidebar + header layout)
│   │   ├── index.tsx     # Landing page
│   │   ├── about.tsx     # About page
│   │   ├── api.rpc.$.tsx # oRPC catch-all server handler
│   │   ├── api/auth/$.ts # Better Auth catch-all handler
│   │   └── demo/         # Feature demos (auth, drizzle, form, orpc, query, table, storybook)
│   ├── stores/           # Zustand client state (theme)
│   ├── index.css         # Tailwind CSS entrypoint
│   ├── router.tsx        # TanStack Router factory + type registration
│   └── routeTree.gen.ts  # Generated router tree (do not edit)
├── stories/              # Storybook stories
├── .storybook/           # Storybook configuration
├── components.json       # shadcn/ui configuration (style: base-nova)
├── pnpm-workspace.yaml   # Dependency catalogs and workspace policy
└── vite.config.ts        # Vite+, TanStack Start, ArkEnv, Vitest, lint, fmt, staged config
```

## Application Surface

### Server-Side Rendering

TanStack Start handles SSR. The HTML document is rendered server-side via `shellComponent` in `src/routes/__root.tsx` — there is no static `index.html`. The root route composes all providers (i18n, TanStack Query, toast, sidebar layout, devtools) and includes a theme-init script to prevent FOUC.

### Server Functions & API Routes

- **`createServerFn`** — used in route loaders/actions to run code on the server (e.g., Drizzle queries in `/demo/drizzle`).
- **`/api/rpc/*`** — oRPC catch-all handler (`src/routes/api.rpc.$.tsx`). The oRPC client (`src/orpc/client.ts`) uses `createIsomorphicFn` to call server functions directly on the server and via HTTP from the client.
- **`/api/auth/*`** — Better Auth handler (`src/routes/api/auth/$.ts`). Supports email/password sign-up, sign-in, sign-out, and session management.

### Demo Routes

| Route             | Feature                                                        |
| ----------------- | -------------------------------------------------------------- |
| `/`               | Landing page — forms, clipboard, Temporal, drawers, Zustand    |
| `/about`          | About page with stack overview                                 |
| `/demo/auth`      | Better Auth sign-up/sign-in/sign-out flow                      |
| `/demo/drizzle`   | Drizzle ORM CRUD via `createServerFn` and route loaders        |
| `/demo/orpc`      | oRPC todo list — type-safe RPC with TanStack Query integration |
| `/demo/query`     | TanStack Query caching and stale-while-revalidate              |
| `/demo/form`      | TanStack Form with Arktype validation                          |
| `/demo/table`     | TanStack Table — sorting, filtering, pagination                |
| `/demo/storybook` | Link to Storybook dev server                                   |

## Tooling

### Vite+ — Unified Toolchain

[Vite+](https://viteplus.dev) replaces separate installs of Vite, Vitest, Oxlint, Oxfmt, and package manager setup with a single `vp` CLI. It also manages Node.js versions via `vp env`.

```bash
vp dev            # Start Vite dev server (SSR enabled via TanStack Start)
vp build          # Production build (server + client bundles)
vp check          # Format + lint + type-check
vp check --fix    # Auto-fix lint/format issues
vp test           # Vitest (unit + browser)
vp install        # Install dependencies (auto-detects pnpm)
vpx <pkg>         # One-off binary execution
```

#### Node.js & Runtime Management

Vite+ manages Node.js versions — no need for nvm, fnm, or mise:

```bash
vp env current    # Show resolved Node.js version
vp env pin lts    # Pin project to latest LTS
vp env install    # Install version from .node-version or package.json
vp env doctor     # Run environment diagnostics
```

The project declares its required Node.js version in `package.json` `devEngines.runtime` (Node 24+). Vite+ reads this automatically.

### Database (Drizzle)

| Command              | Purpose                                |
| -------------------- | -------------------------------------- |
| `vp run db:generate` | Generate SQL migrations from schema    |
| `vp run db:migrate`  | Run pending migrations                 |
| `vp run db:push`     | Push schema directly (dev convenience) |
| `vp run db:pull`     | Introspect DB and update schema        |
| `vp run db:studio`   | Open Drizzle Studio GUI                |

Schema is defined in `src/db/schema.ts`. Config in `drizzle.config.ts` (dialect: `sqlite`, DB at `data/sqlite.db`).

### Development

| Tool                                                                   | Use for                                                                                          | Docs                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [Vite Devtools](https://devtools.vite.dev/)                            | In-browser devtools overlay — inspect modules, routes, assets, performance. Set `DEVTOOLS=true`. | [GitHub](https://github.com/vitejs/devtools)                |
| [TanStack Devtools](https://tanstack.com/devtools)                     | Unified devtools panel for Router, Query, and Form — auto-configured.                            | [Docs](https://tanstack.com/devtools)                       |
| [es-toolkit](https://es-toolkit.slash.page)                            | Modern, tree-shakeable utility library (lodash alternative).                                     | [Docs](https://es-toolkit.slash.page)                       |
| [temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill) | Polyfill for TC39 Temporal API — modern date/time without `Date` or Moment.                      | [GitHub](https://github.com/fullcalendar/temporal-polyfill) |
| [taze](https://github.com/antfu-collective/taze)                       | Check and bump outdated deps interactively: `vpx taze`.                                          | [GitHub](https://github.com/antfu-collective/taze)          |
| [zx](https://google.github.io/zx/)                                     | Write shell scripts in JS/TS.                                                                    | [GitHub](https://github.com/google/zx)                      |

### Code Quality

| Tool                     | Use for                                                              | Docs                         |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------- |
| [Knip](https://knip.dev) | Find unused files, exports, and dependencies. Config in `knip.json`. | [knip.dev](https://knip.dev) |

### CI / CD & Git Hooks

| Tool                                                          | Use for                                                                                                         | Docs                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Vite+ Commit Hooks](https://viteplus.dev/guide/commit-hooks) | `vp config` installs Git hooks; `vp staged` runs checks on staged files via `staged` block in `vite.config.ts`. | [viteplus.dev](https://viteplus.dev/guide/commit-hooks) |
| [@commitlint/config-conventional](https://commitlint.js.org)  | Enforce [Conventional Commits](https://www.conventionalcommits.org/) format on commit messages.                 | [commitlint.js.org](https://commitlint.js.org)          |

### Import Aliases

The project uses [Node.js subpath imports](https://nodejs.org/api/packages.html#subpath-imports) instead of tsconfig `paths` or Vite `resolve.alias`:

```jsonc
// package.json
"imports": {
  "#/*": ["./src/*", "./src/*.ts", "./src/*.tsx"]
}
```

```ts
import { cn } from '#/lib/utils'
import { Button } from '#/components/ui/button'
import { db } from '#/db/index'
```

- `#/` prefix maps to `src/` — works natively in Vite, TypeScript 6+ (`moduleResolution: "bundler"`), and Vitest.
- No additional config in `tsconfig.json` or `vite.config.ts` required.
- shadcn/ui components are generated with `#/` imports via `components.json` aliases.

### Type Safety

| Tool                                                                       | Use for                                                                           | Docs                                                               |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [@total-typescript/ts-reset](https://github.com/total-typescript/ts-reset) | Stricter built-in TS types (e.g., `.json()` → `unknown`).                         | [GitHub](https://github.com/total-typescript/ts-reset)             |
| [@typescript/native-preview](https://github.com/microsoft/typescript-go)   | Native Go port of tsc (10× faster). Run `vpx tsgo`.                               | [GitHub](https://github.com/microsoft/typescript-go)               |
| [Arktype](https://arktype.io)                                              | Runtime type validation with 1:1 TS syntax — search params, API responses, forms. | [arktype.io](https://arktype.io)                                   |
| [ArkEnv](https://arkenv.js.org)                                            | Env var validation via Arktype. Used in `vite.config.ts`.                         | [arkenv.js.org](https://arkenv.js.org)                             |
| [ArkRegex](https://github.com/arktypeio/arktype/tree/main/ark/regex)       | Type-safe regex patterns with inferred string literal types.                      | [GitHub](https://github.com/arktypeio/arktype/tree/main/ark/regex) |

### Testing

| Tool                                                                           | Use for                                                            | Docs                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [Vitest](https://vitest.dev) (via Vite+)                                       | Unit + browser tests. Run `vp test`. Config in `vite.config.ts`.   | [vitest.dev](https://vitest.dev)                                        |
| [vitest-browser-react](https://vitest.dev/guide/browser/)                      | Render React components in a real browser via Vitest Browser Mode. | [Vitest Browser Mode](https://vitest.dev/guide/browser/)                |
| [@playwright/cli](https://playwright.dev)                                      | Browser automation CLI.                                            | [playwright.dev](https://playwright.dev)                                |
| [msw-storybook-addon](https://github.com/mswjs/msw-storybook-addon)            | Mock API requests in Storybook stories using MSW.                  | [GitHub](https://github.com/mswjs/msw-storybook-addon)                  |
| [@storybook/addon-a11y](https://storybook.js.org/addons/@storybook/addon-a11y) | Accessibility audit panel in Storybook.                            | [Storybook a11y](https://storybook.js.org/addons/@storybook/addon-a11y) |

### UI Components

Add shadcn/ui components with `vpx shadcn@canary`. Config in `components.json` (style: `base-nova`).

## Environment Variables

Validated at build time via [ArkEnv](https://arkenv.js.org) in `vite.config.ts`:

| Variable                | Type / Default          | Description                         |
| ----------------------- | ----------------------- | ----------------------------------- |
| `PORT`                  | `number.port` / `5173`  | Dev server port                     |
| `DEVTOOLS`              | `boolean` / `false`     | Enable Vite Devtools                |
| `VITE_API_URL`          | `string.url` (optional) | API base URL (client-side)          |
| `VITE_APP_NAME`         | `string` (optional)     | Application display name            |
| `VITE_ENABLE_DEBUGGING` | `boolean` / `false`     | Enable client debug logging         |
| `VITE_API_TIMEOUT`      | `1000–60000` / `5000`   | API request timeout (ms)            |
| `BETTER_AUTH_URL`       | `string` (optional)     | Auth base URL (default `localhost`) |

## Supply-Chain Security

Hardened in `pnpm-workspace.yaml` to mitigate dependency supply-chain attacks:

| Setting              | Value          | Effect                                                                               |
| -------------------- | -------------- | ------------------------------------------------------------------------------------ |
| `blockExoticSubdeps` | `true`         | Transitive deps cannot use git/tarball sources — registry packages only              |
| `strictDepBuilds`    | `true`         | Unlisted build scripts error instead of warn                                         |
| `allowBuilds`        | explicit map   | Only allowlisted packages may run install scripts (replaces `onlyBuiltDependencies`) |
| `trustPolicy`        | `no-downgrade` | Block packages whose provenance/signature trust level has regressed                  |

**Adding a new package with install scripts:** add it to `allowBuilds` in `pnpm-workspace.yaml`.

**Trust policy failures:** if a legitimate package triggers `trustPolicy`, add it to `trustPolicyExclude` with the exact version (e.g., `chokidar@4.0.3`).

## AI-Assisted Development

| Resource                                            | Purpose                                                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                                         | Project-wide instructions for coding agents.                                                             |
| `.agents/skills/`                                   | Domain-specific knowledge for react, vitest, pnpm, shadcn, zustand-x, tdd, shield-pipeline, find-skills. |
| [Context7 MCP](https://github.com/upstash/context7) | Fetches up-to-date library docs. Configured in `.vscode/mcp.json`.                                       |

## Editor Tooling

- 12 recommended VS Code extensions in `.vscode/extensions.json` (Copilot, ErrorLens, GitLens, Tailwind IntelliSense, ArkDark, Vite+, native TS preview, etc.)
- Shared editor and task settings in `.vscode/settings.shared.json` and `.vscode/tasks.shared.json`
- MCP server config in `.vscode/mcp.json` (Context7)

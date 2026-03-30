# React 2026 Template

Modern React 19 starter with TanStack Router, TanStack Query, Tailwind CSS 4, shadcn/ui, Arktype, Storybook, and Vite+.

## Getting Started

### Install vp

#### macOS / Linux

```bash
curl -fsSL https://vite.plus | bash
```

#### Windows

```powershell
irm https://vite.plus/ps1 | iex
```

After installation, open a new shell and run:

```bash
git clone https://github.com/Jkker/react-template.git
cd react-template

vp install
```

The dev server uses `PORT` from `.env` (default `5173`). The postinstall hook runs `vp config` (Git hooks) and installs the Chromium binary for Playwright-backed browser tests.

## Tech Stack

| Category   | Technology                                               |
| ---------- | -------------------------------------------------------- |
| Core       | React 19 with React Compiler                             |
| Build      | Vite+ (Vite 8, Rolldown, Vitest, Oxlint, Oxfmt)          |
| Routing    | TanStack Router (file-based, generated route tree)       |
| Data       | TanStack Query                                           |
| Forms      | TanStack Form + Arktype validation                       |
| State      | Zustand / Zustand X                                      |
| Validation | Arktype, ArkEnv, ArkRegex                                |
| Styling    | Tailwind CSS 4, class-variance-authority, tailwind-merge |
| UI         | shadcn/ui (base-nova), Base UI, Lucide                   |
| i18n       | i18next, react-i18next, http-backend, language detector  |
| Testing    | Vitest (via Vite+), vitest-browser-react, Playwright     |
| Docs       | Storybook 10                                             |
| Quality    | Vite+ (`vp check`), Knip, Commitlint                     |

## Project Structure

```text
.
├── public/
│   ├── locales/          # Translation resources loaded by i18next
│   └── robots.txt
├── scripts/              # Utility scripts and Docker CI images
├── src/
│   ├── components/
│   │   ├── examples/     # Demo feature components shown on the index route
│   │   ├── layout/       # App header, sidebar, and related layout pieces
│   │   └── ui/           # Reusable UI primitives (shadcn-derived)
│   ├── hooks/            # Shared React hooks
│   ├── lib/              # App libraries: i18n, router, query, stores, utilities
│   ├── routes/           # File-based routes for TanStack Router
│   ├── stores/           # Cross-app client state (e.g., theme)
│   ├── index.css         # Tailwind CSS entrypoint
│   ├── main.tsx          # React bootstrap and provider composition
│   └── routeTree.gen.ts  # Generated router tree (do not edit)
├── stories/              # Storybook stories
├── .storybook/           # Storybook configuration
├── components.json       # shadcn/ui configuration (style: base-nova)
├── pnpm-workspace.yaml   # Dependency catalogs and workspace policy
└── vite.config.ts        # Vite+, ArkEnv, TanStack Router, Vitest, lint, fmt, staged config
```

## Application Surface

- `src/main.tsx` composes i18n, TanStack Query, toast, router, and devtools providers.
- `src/routes/__root.tsx` defines the app shell with sidebar + header layout.
- `src/routes/index.tsx` is a demo landing page (forms, clipboard, Temporal helpers, drawers, Zustand state).
- Additional routes under `/app` and `/deep/nested` demonstrate nested routing.

## Tooling

### Development

| Tool                                                                   | Use for                                                                                          | Docs                                                        |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| [Vite+](https://viteplus.dev)                                          | Unified toolchain —`vp check` runs Oxlint + Oxfmt + type-check; `vp lint` / `vp fmt` standalone. | [viteplus.dev](https://viteplus.dev)                        |
| [Vite Devtools](https://devtools.vite.dev/)                            | In-browser devtools overlay — inspect modules, routes, assets, performance. Set `DEVTOOLS=true`. | [GitHub](https://github.com/vitejs/devtools)                |
| [es-toolkit](https://es-toolkit.slash.page)                            | Modern, tree-shakeable utility library (lodash alternative).                                     | [Docs](https://es-toolkit.slash.page)                       |
| [temporal-polyfill](https://github.com/fullcalendar/temporal-polyfill) | Polyfill for TC39 Temporal API — modern date/time without `Date` or Moment.                      | [GitHub](https://github.com/fullcalendar/temporal-polyfill) |
| [taze](https://github.com/antfu-collective/taze)                       | Check and bump outdated deps interactively:`vpx taze`.                                           | [GitHub](https://github.com/antfu-collective/taze)          |
| [zx](https://google.github.io/zx/)                                     | Write shell scripts in JS/TS. Available in the `build` catalog.                                  | [GitHub](https://github.com/google/zx)                      |

### Code Quality

| Tool                     | Use for                                                              | Docs                         |
| ------------------------ | -------------------------------------------------------------------- | ---------------------------- |
| [Knip](https://knip.dev) | Find unused files, exports, and dependencies. Config in `knip.json`. | [knip.dev](https://knip.dev) |

### CI / CD & Git Hooks

| Tool                                                          | Use for                                                                                                         | Docs                                                    |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Vite+ Commit Hooks](https://viteplus.dev/guide/commit-hooks) | `vp config` installs Git hooks; `vp staged` runs checks on staged files via `staged` block in `vite.config.ts`. | [viteplus.dev](https://viteplus.dev/guide/commit-hooks) |
| [@commitlint/config-conventional](https://commitlint.js.org)  | Enforce[Conventional Commits](https://www.conventionalcommits.org/) format on commit messages.                  | [commitlint.js.org](https://commitlint.js.org)          |

### Type Safety

| Tool                                                                       | Use for                                                                           | Docs                                                               |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [@total-typescript/ts-reset](https://github.com/total-typescript/ts-reset) | Stricter built-in TS types (e.g.,`.json()` → `unknown`).                          | [GitHub](https://github.com/total-typescript/ts-reset)             |
| [@typescript/native-preview](https://github.com/microsoft/typescript-go)   | Native Go port of tsc (10× faster). Run `vpx tsgo`.                               | [GitHub](https://github.com/microsoft/typescript-go)               |
| [Arktype](https://arktype.io)                                              | Runtime type validation with 1:1 TS syntax — search params, API responses, forms. | [arktype.io](https://arktype.io)                                   |
| [ArkEnv](https://arkenv.js.org)                                            | Env var validation via Arktype. Used in `vite.config.ts`.                         | [arkenv.js.org](https://arkenv.js.org)                             |
| [ArkRegex](https://github.com/arktypeio/arktype/tree/main/ark/regex)       | Type-safe regex patterns with inferred string literal types.                      | [GitHub](https://github.com/arktypeio/arktype/tree/main/ark/regex) |

### Testing

| Tool                                                                           | Use for                                                            | Docs                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| [Vitest](https://vitest.dev) (via Vite+)                                       | Unit + browser tests. Run `vp test`. Config in `vite.config.ts`.   | [vitest.dev](https://vitest.dev)                                        |
| [vitest-browser-react](https://vitest.dev/guide/browser/)                      | Render React components in a real browser via Vitest Browser Mode. | [Vitest Browser Mode](https://vitest.dev/guide/browser/)                |
| [@playwright/cli](https://playwright.dev)                                      | Browser automation CLI.                                            | [playwright.dev](https://playwright.dev)                                |
| [msw-storybook-addon](https://github.com/mswjs/msw-storybook-addon)            | Mock API requests in Storybook stories using MSW.                  | [GitHub](https://github.com/mswjs/msw-storybook-addon)                  |
| [@storybook/addon-a11y](https://storybook.js.org/addons/@storybook/addon-a11y) | Accessibility audit panel in Storybook.                            | [Storybook a11y](https://storybook.js.org/addons/@storybook/addon-a11y) |

### UI Components

Add shadcn/ui components with `vpx shadcn`. Config in `components.json` (style: `base-nova`).

## AI-Assisted Development

| Resource                                              | Purpose                                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                                           | Project-wide instructions for coding agents.                                                                          |
| `.agents/skills/`                                     | Domain-specific knowledge for playwright-cli, react, shadcn, tanstack-intent, tdd, vitest, zustand-x.                 |
| [TanStack Intent](https://github.com/TanStack/intent) | Discovers package-shipped agent skills and helps maintain `intent-skills` mappings via `vpx @tanstack/intent@latest`. |
| [Context7 MCP](https://github.com/upstash/context7)   | Fetches up-to-date library docs. Configured in `.vscode/mcp.json`.                                                    |

## Editor Tooling

- 11 recommended VS Code extensions in `.vscode/extensions.json` (Copilot, ErrorLens, GitLens, Tailwind IntelliSense, Vitest Explorer, ArkDark, Oxc, native TS preview, etc.)
- Shared editor and task settings in `.vscode/settings.shared.json` and `.vscode/tasks.shared.json`
- MCP server config in `.vscode/mcp.json` (Context7)

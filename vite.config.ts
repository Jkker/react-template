import arkenvVitePlugin from '@arkenv/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools as tanstackDevtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { type } from 'arkenv'
import { defineConfig } from 'vite-plus'
import { playwright } from 'vite-plus/test/browser-playwright'

export const Env = type({
  PORT: 'number.port = 5173',
  DEVTOOLS: 'boolean = false',
  'VITE_API_URL?': 'string.url',
  'VITE_APP_NAME?': 'string',
  VITE_ENABLE_DEBUGGING: 'boolean = false',
  VITE_API_TIMEOUT: '1000 <= number.integer <= 60000 = 5000',
})

const CI = !!process.env.CI

export default defineConfig({
  plugins: [
    tanstackDevtools(),
    tanstackRouter({ target: 'react' }),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    arkenvVitePlugin(Env),
  ],
  devtools: { enabled: process.env.DEVTOOLS === 'true' },
  optimizeDeps: {
    include: ['i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
  },
  server: { port: Number(process.env.PORT) || 5173 },
  run: {
    tasks: {
      ready: {
        command: 'knip',
        dependsOn: ['fix', 'build', 'test'],
      },
    },
  },
  // ── Format (oxfmt) ────────────────────────────────────────────────
  fmt: {
    ignorePatterns: [
      '**/routeTree.gen.ts',
      '.nx',
      '.tanstack',
      'dist',
      'node_modules',
      'storybook-static',
      'pnpm-lock.yaml',
      'assets',
    ],
    tabWidth: 2,
    useTabs: false,
    semi: false,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 100,
    sortPackageJson: true,
    sortImports: {
      partitionByComment: true,
      internalPattern: ['#/'],
    },
    sortTailwindcss: {
      functions: ['clsx', 'cn', 'cva'],
      stylesheet: 'src/index.css',
    },
  },

  // ── Lint (oxlint) ─────────────────────────────────────────────────
  lint: {
    options: { typeAware: true, typeCheck: true, reportUnusedDisableDirectives: 'warn' },
    plugins: ['unicorn', 'eslint', 'typescript', 'oxc', 'import', 'promise', 'react', 'react-perf'],
    jsPlugins: [
      { name: 'react-hooks-js', specifier: 'eslint-plugin-react-hooks' },
      'eslint-plugin-react-you-might-not-need-an-effect',
    ],
    categories: { correctness: 'deny', suspicious: 'warn' },
    env: { builtin: true, es2026: true, browser: true },
    rules: {
      curly: ['warn', 'multi'],
      'arrow-body-style': ['warn', 'as-needed'],
      'no-shadow': 0,
      'no-useless-rename': 'warn',
      'no-var': 'deny',
      'no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'oxc/branches-sharing-code': 'error',
      'oxc/no-barrel-file': 'error',

      'import/export': 'deny',
      'import/no-duplicates': 'warn',
      'import/no-empty-named-blocks': 'warn',
      'import/no-cycle': 'deny',
      'import/no-named-default': 'warn',
      'import/namespace': 0,
      'import/named': 0,
      'import/default': 0,
      'import/no-named-as-default-member': 0,
      'import/no-named-as-default': 0,
      'import/no-unassigned-import': [
        'warn',
        {
          allow: [
            '**/*.css',
            'react',
            'temporal-polyfill/global',
            'vite-plus/test/browser/context',
          ],
        },
      ],

      'typescript/no-explicit-any': 'warn',
      'typescript/no-unnecessary-type-constraint': 'warn',
      'typescript/no-redundant-type-constituents': 'warn',
      'typescript/no-useless-empty-export': 'warn',
      'typescript/no-unsafe-type-assertion': 0,
      'typescript/no-extra-non-null-assertion': 'deny',
      'typescript/no-non-null-asserted-optional-chain': 'deny',
      'typescript/prefer-as-const': 'warn',
      'typescript/no-duplicate-enum-values': 'deny',
      'typescript/triple-slash-reference': 'deny',
      'typescript/no-misused-new': 'deny',
      'typescript/no-this-alias': 'warn',
      'typescript/no-unsafe-declaration-merging': 'deny',
      'typescript/await-thenable': 'deny',
      'typescript/no-floating-promises': 'deny',
      'typescript/no-for-in-array': 'deny',
      'typescript/no-implied-eval': 'deny',
      'typescript/no-base-to-string': 'warn',
      'typescript/restrict-template-expressions': 'warn',
      'typescript/unbound-method': 'warn',

      'unicorn/no-array-for-each': 'warn',
      'unicorn/prefer-array-find': 'warn',

      'promise/param-names': 'deny',
      'promise/no-new-statics': 'deny',
      'promise/valid-params': 'deny',

      // React rules
      'react/rules-of-hooks': 'deny',
      'react/exhaustive-deps': 'warn',
      'react/only-export-components': 0,
      'react/react-in-jsx-scope': 0,
      'react/self-closing-comp': 'warn',
      'react/jsx-no-useless-fragment': 'warn',
      'react/button-has-type': 'warn',
      'react/jsx-fragments': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never', propElementValues: 'always' },
      ],

      // ref:
      // - https://github.com/TheAlexLichter/oxlint-react-compiler-rules/issues/1
      // - https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md#custom-configuration
      // Recommended rules (from LintRulePreset.Recommended)
      'react-hooks-js/config': 'deny',
      'react-hooks-js/error-boundaries': 'deny',
      'react-hooks-js/gating': 'deny',
      'react-hooks-js/globals': 'deny',
      'react-hooks-js/immutability': 'deny',
      'react-hooks-js/incompatible-library': 'warn',
      'react-hooks-js/preserve-manual-memoization': 'deny',
      'react-hooks-js/purity': 'deny',
      'react-hooks-js/refs': 'deny',
      'react-hooks-js/set-state-in-effect': 'warn',
      'react-hooks-js/set-state-in-render': 'deny',
      'react-hooks-js/static-components': 'deny',
      'react-hooks-js/unsupported-syntax': 'warn',
      'react-hooks-js/use-memo': 'deny',
      // Recommended-latest rules (from LintRulePreset.RecommendedLatest)
      'react-hooks-js/void-use-memo': 'deny',
      // https://github.com/nickjvandyke/eslint-plugin-react-you-might-not-need-an-effect
      'react-you-might-not-need-an-effect/no-derived-state': 'warn',
      'react-you-might-not-need-an-effect/no-chain-state-updates': 'warn',
      'react-you-might-not-need-an-effect/no-event-handler': 'warn',
      'react-you-might-not-need-an-effect/no-adjust-state-on-prop-change': 'warn',
      'react-you-might-not-need-an-effect/no-reset-all-state-on-prop-change': 'warn',
      'react-you-might-not-need-an-effect/no-pass-live-state-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-pass-data-to-parent': 'warn',
      'react-you-might-not-need-an-effect/no-initialize-state': 'warn',
    },
    settings: {
      react: { formComponents: [], linkComponents: ['Link'], version: '19.2' },
      vitest: { typecheck: true },
    },
    overrides: [
      {
        files: ['**/*.{test,spec}.*', '**/tests/**/*.*', 'docs/storybook/.storybook/*'],
        plugins: ['vitest'],
        rules: {
          'unicorn/consistent-function-scoping': 'off',
          'typescript/no-explicit-any': 'off',
          'typescript/no-unsafe-argument': 'off',
          'typescript/no-unsafe-assignment': 'off',
          'typescript/no-unsafe-call': 'off',
          'typescript/no-unsafe-member-access': 'off',
          'typescript/no-unsafe-return': 'off',
          'typescript/no-unsafe-type-assertion': 'off',
          'react/rules-of-hooks': 'off',
        },
      },
      {
        files: ['**/components/ui/**/*.{ts,tsx}', '**/hooks/**/*.{ts,tsx}', '**/lib/**/*.{ts,tsx}'],
        rules: { 'react/only-export-components': 'off' },
      },
    ],
    ignorePatterns: [
      'public',
      'tmp',
      'dist',
      'build',
      'node_modules',
      '.turbo',
      '.tanstack',
      '**/routeTree.gen.ts',
    ],
  },

  // ── Staged (pre-commit) ───────────────────────────────────────────
  staged: {
    '*.{js,ts,jsx,tsx}': 'vp check --fix',
    '*.{json,md,css,html,yml,yaml}': 'vp fmt',
  },

  // ── Test (vitest) ─────────────────────────────────────────────────
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['./**/*.test.tsx', './**/*.test.browser.{ts,tsx}'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            trace: 'on-first-retry',
          },
        },
        optimizeDeps: { include: ['react-dom/client'] },
      },
    ],
    silent: 'passed-only',
    reporters: CI ? ['default', 'junit'] : [],
    outputFile: { junit: 'junit-test-report.xml' },
    coverage: {
      reportsDirectory: './coverage',
      exclude: ['src/components/ui/*', 'routeTree.gen.ts'],
      reporter: CI ? ['text', 'cobertura', 'lcov'] : ['html', 'text'],
    },
  },
})

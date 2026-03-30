import { type } from 'arktype';
import { createStore, useStoreValue } from 'zustand-x';

import { checkMediaQuery, subscribeToMediaQuery } from '#/hooks/use-media-query';

const MEDIA_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'theme';
const ThemeValue = type("'dark' | 'light' | 'system'");

export type Theme = typeof ThemeValue.infer;
export type ResolvedTheme = Exclude<Theme, 'system'>;

let isThemeStoreInitialized = false;

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const storedTheme = ThemeValue(window.localStorage.getItem(STORAGE_KEY));
  return storedTheme instanceof type.errors ? 'system' : storedTheme;
};

const resolveTheme = (theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme =>
  theme === 'system' ? systemTheme : theme;

const applyTheme = (resolvedTheme: ResolvedTheme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
};

/**
 * Shared theme store for app-wide preference and resolved color mode.
 * @remarks Initializes once on import and keeps the root HTML class in sync.
 */
export const themeStore = createStore(
  { theme: 'system' as Theme, systemTheme: 'light' as ResolvedTheme },
  { name: 'theme' },
)
  .extendSelectors(({ get }) => ({
    resolvedTheme: () => {
      const theme = get('theme');
      return theme === 'system' ? get('systemTheme') : theme;
    },
  }))
  .extendSelectors(({ get }) => ({
    isDark: () => get('resolvedTheme') === 'dark',
  }))
  .extendActions(({ get, set }) => ({
    setTheme: (theme: Theme) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, theme);
      }

      set('theme', theme);
      applyTheme(resolveTheme(theme, get('systemTheme')));
    },
    setSystemTheme: (systemTheme: ResolvedTheme) => {
      set('systemTheme', systemTheme);
      applyTheme(resolveTheme(get('theme'), systemTheme));
    },
  }))
  .extendActions(({ get, actions }) => ({
    toggleTheme: () => actions.setTheme(get('resolvedTheme') === 'dark' ? 'light' : 'dark'),
  }));

const initializeThemeStore = () => {
  const systemTheme = checkMediaQuery(MEDIA_QUERY) ? 'dark' : 'light';
  const theme = getStoredTheme();

  themeStore.set('systemTheme', systemTheme);
  themeStore.set('theme', theme);
  applyTheme(resolveTheme(theme, systemTheme));

  if (typeof window === 'undefined' || isThemeStoreInitialized) {
    return;
  }

  subscribeToMediaQuery(MEDIA_QUERY, (matches) =>
    themeStore.actions.setSystemTheme(matches ? 'dark' : 'light'),
  );
  isThemeStoreInitialized = true;
};

initializeThemeStore();

/**
 * Persists a user theme preference into the shared store.
 * @remarks Use `'system'` to follow the operating system color scheme.
 */
export const setTheme = (theme: Theme) => themeStore.actions.setTheme(theme);

/**
 * Returns the current theme preference, resolved theme, and setter.
 * @remarks `resolvedTheme` is always either `'light'` or `'dark'`.
 */
export const useTheme = () => {
  const theme = useStoreValue(themeStore, 'theme');
  const resolvedTheme = useStoreValue(themeStore, 'resolvedTheme');

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
};

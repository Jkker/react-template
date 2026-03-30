import { beforeEach, expect, test, vi } from 'vite-plus/test';

const setupThemeDom = ({
  matches = false,
  storedTheme = null,
}: {
  matches?: boolean;
  storedTheme?: string | null;
}) => {
  const classNames = new Set<string>();
  const localStorage = {
    getItem: vi.fn((key: string) => (key === 'theme' ? storedTheme : null)),
    setItem: vi.fn((key: string, value: string) => {
      if (key === 'theme') {
        storedTheme = value;
      }
    }),
  };
  const matchMedia = vi.fn(() => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const classList = {
    add: (...tokens: string[]) => {
      for (const token of tokens) {
        classNames.add(token);
      }
    },
    remove: (...tokens: string[]) => {
      for (const token of tokens) {
        classNames.delete(token);
      }
    },
  };
  const document = { documentElement: { classList } };
  const window = { document, localStorage, matchMedia };

  Reflect.set(globalThis, 'document', document);
  Reflect.set(globalThis, 'window', window);

  return {
    classNames,
    localStorage,
  };
};

beforeEach(() => {
  vi.resetModules();
  vi.unstubAllGlobals();
});

test('falls back to system theme when stored value is invalid', async () => {
  const { classNames } = setupThemeDom({ matches: true, storedTheme: 'sepia' });
  const { themeStore } = await import('#/stores/theme');

  expect(themeStore.get('theme')).toBe('system');
  expect(themeStore.get('resolvedTheme')).toBe('dark');
  expect(classNames.has('dark')).toBe(true);
  expect(classNames.has('light')).toBe(false);
});

test('persists and applies explicit theme changes', async () => {
  const { classNames, localStorage } = setupThemeDom({ matches: true, storedTheme: 'system' });
  const { setTheme, themeStore } = await import('#/stores/theme');

  setTheme('light');

  expect(themeStore.get('theme')).toBe('light');
  expect(themeStore.get('resolvedTheme')).toBe('light');
  expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  expect(classNames.has('light')).toBe(true);
  expect(classNames.has('dark')).toBe(false);
});

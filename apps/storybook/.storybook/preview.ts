import type { Decorator, Preview } from '@storybook/vue3-vite'
import '../src/styles/main.css'
import '@larevo/config/fonts.css'

// Tokens from @larevo/config/tailwind: paper (light page) / night (dark page)
const PAGE_BG = { light: '#FDFDFD', dark: '#15171c' } as const

const withTheme: Decorator = (story, context) => {
  const theme = context.globals.theme === 'dark' ? 'dark' : 'light'
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.body.style.backgroundColor = PAGE_BG[theme]
  return story()
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // theme decorator owns the canvas background
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Night', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
}

export default preview

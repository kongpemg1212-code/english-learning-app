import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const aiStoryProxyUrl =
  process.env.VITE_AI_STORY_PROXY_URL ||
  'https://kids-word-story-api.kongpemg1212.workers.dev/'

export default defineConfig({
  base: './',
  define: {
    __AI_STORY_PROXY_URL__: JSON.stringify(aiStoryProxyUrl),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('all-words.json')) {
            return 'word-pack-core'
          }

          if (id.includes('@supabase')) {
            return 'vendor-supabase'
          }

          if (id.includes('framer-motion')) {
            return 'vendor-motion'
          }

          if (id.includes('react-router')) {
            return 'vendor-router'
          }

          if (id.includes('node_modules/react')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { build } from 'esbuild'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const outdir = path.join(projectRoot, 'dist', 'standalone-bundle')

await fs.rm(outdir, { recursive: true, force: true })

const result = await build({
  entryPoints: [path.join(projectRoot, 'src', 'main.tsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  define: {
    'import.meta.env.VITE_SUPABASE_URL': 'undefined',
    'import.meta.env.VITE_SUPABASE_ANON_KEY': 'undefined',
    'import.meta.env.VITE_PUBLIC_APP_URL': 'undefined',
  },
  outdir,
  write: false,
  loader: {
    '.svg': 'dataurl',
    '.png': 'dataurl',
    '.json': 'json',
  },
})

const jsFile = result.outputFiles.find((file) => file.path.endsWith('.js'))
const cssFile = result.outputFiles.find((file) => file.path.endsWith('.css'))

if (!jsFile) {
  throw new Error('Standalone bundle generation failed: missing JS output')
}

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Word Garden Quest</title>
    <style>${cssFile ? cssFile.text : ''}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${jsFile.text}</script>
  </body>
</html>
`

await fs.writeFile(path.join(projectRoot, 'dist', 'standalone.html'), html, 'utf8')

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite's SPA fallback does not resolve directory indexes in public/ during dev.
function serveTimeVolume(server) {
  server.middlewares.use((req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path === '/lab/015' || path === '/lab/015/') {
      res.writeHead(302, { Location: '/lab/015/index.html' })
      res.end()
      return
    }
    next()
  })
}

export default defineConfig({
  plugins: [react(), {
    name: 'time-volume-directory-index',
    configureServer: serveTimeVolume,
    configurePreview: serveTimeVolume,
  }],
})

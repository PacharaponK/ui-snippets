import { Readable } from 'node:stream'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { snippetSource } from './server/snippetSource.js'
import { authorizeMemberAsset, handleSession, libraryCredentials, memberAssetsPath, privateHeaders, sessionPath } from './server/libraryAccess.js'

function localLibraryAccess(credentials) {
  function configure(server) {
    server.middlewares.use(async (incoming, outgoing, next) => {
      const url = new URL(incoming.url, `http://${incoming.headers.host}`)
      const path = url.pathname
      const isSession = path === sessionPath
      const isMemberAsset = path.startsWith(memberAssetsPath)
        || path === '/src/data/customizeRegistry.js'
        || path.startsWith('/src/examples/customize/')
      if (!isSession && !isMemberAsset) return next()

      try {
        const request = new Request(url, {
          method: incoming.method,
          headers: incoming.headers,
          ...(incoming.method === 'POST' && { body: Readable.toWeb(incoming), duplex: 'half' }),
        })
        const response = isSession
          ? await handleSession(request, credentials)
          : authorizeMemberAsset(request, credentials)
        if (!response) {
          for (const [name, value] of Object.entries(privateHeaders)) outgoing.setHeader(name, value)
          return next()
        }

        outgoing.statusCode = response.status
        for (const [name, value] of response.headers) outgoing.setHeader(name, value)
        outgoing.end(Buffer.from(await response.arrayBuffer()))
      } catch (error) {
        next(error)
      }
    })
  }

  return {
    name: 'local-library-access',
    configureServer: configure,
    configurePreviewServer: configure,
  }
}

const privateDirectory = memberAssetsPath.slice(1)
const customizeRegistry = '/src/data/customizeRegistry.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'UI_SNIPPETS_')
  const credentials = libraryCredentials(env.UI_SNIPPETS_ACCESS_KEY, env.UI_SNIPPETS_SESSION_SECRET)

  return {
    plugins: [snippetSource(), vue(), localLibraryAccess(credentials)],
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: chunk => chunk.facadeModuleId?.endsWith(customizeRegistry)
            ? `${privateDirectory}[name]-[hash].js`
            : 'assets/[name]-[hash].js',
          assetFileNames: asset => asset.names.includes('customizeRegistry.css')
            ? `${privateDirectory}[name]-[hash][extname]`
            : 'assets/[name]-[hash][extname]',
        },
      },
    },
  }
})

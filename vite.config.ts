import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // Optimizaciones de compilación
            hoistStatic: true,
            cacheHandlers: true,
          },
        },
      }),
      vueJsx(),
      vueDevTools(),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
        '@shared': fileURLToPath(new URL('./src/core/shared', import.meta.url)),
        '@tenant': fileURLToPath(new URL('./src/core/tenant', import.meta.url)),
        '@auth': fileURLToPath(new URL('./src/modules/auth', import.meta.url)),
        '@admin': fileURLToPath(new URL('./src/modules/admin', import.meta.url)),
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
    },

    server: {
      port: 5173,
      host: true,
      allowedHosts: [
        'localhost',
        'farmasys.local',
        '.farmasys.local', // Wildcard para todos los subdominios
      ],
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // Configuración de cookies para httpOnly
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              // Asegurar que las cookies se envíen en las peticiones
              if (req.headers.cookie) {
                proxyReq.setHeader('cookie', req.headers.cookie)
              }
            })
          },
        },
      },
    },

    preview: {
      port: 4173,
      host: true,
      open: true,
      allowedHosts: [
        'farmasys.local',
        'farmacia-central.farmasys.local',
        'localhost',
        '.farmasys.local',
      ],
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            vendor: ['axios', '@vueuse/core', 'zod'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios'],
    },

    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  }
})

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    
    // Оптимизации для Core Web Vitals
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        services: resolve(__dirname, 'src/services.html'),
        marketplace: resolve(__dirname, 'src/marketplace.html'),
        urgent: resolve(__dirname, 'src/urgent.html'),
        about: resolve(__dirname, 'src/about.html'),
        contact: resolve(__dirname, 'src/contact.html'),
        faq: resolve(__dirname, 'src/faq.html'),
        privacy: resolve(__dirname, 'src/privacy.html')
      },
      
      output: {
        // Разделение чанков для лучшей загрузки
        manualChunks: {
          vendor: ['axios', 'openai'],
          ui: ['./src/lib/ui-components.ts'],
          calculator: ['./src/lib/calculator.ts'],
          analytics: ['./src/lib/analytics.ts']
        }
      }
    },
    
    // Минификация для production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // CSS оптимизация
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Development сервер
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  
  // Предварительная обработка CSS
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/variables.scss";
          @import "./src/styles/mixins.scss";
        `
      }
    },
    
    // PostCSS для автопрефиксов
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },
  
  // Оптимизация зависимостей
  optimizeDeps: {
    include: ['axios', 'openai'],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // Резолвинг путей
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@data': resolve(__dirname, 'src/data'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Переменные окружения
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },
  
  // PWA плагины (добавим позже)
  plugins: []
});
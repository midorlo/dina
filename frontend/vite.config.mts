// vite.config.mts
import { fileURLToPath, URL } from 'node:url';
import Vue from '@vitejs/plugin-vue';
// Utilities
import { visualizer } from 'rollup-plugin-visualizer';
// Plugins
import AutoImport from 'unplugin-auto-import/vite';
import Fonts from 'unplugin-fonts/vite';
import Components from 'unplugin-vue-components/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';

import Layouts from 'vite-plugin-vue-layouts-next';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 1) Router zuerst (generiert Routen, die Vue später konsumiert)
    VueRouter({
      dts: 'src/typed-router.d.ts'
    }),

    // 2) Layouts (nutzt die generierten Routen/Meta)
    Layouts(),

    // 3) Auto-Imports (Vue/Router/Pinia Composables)
    AutoImport({
      imports: [
        'vue',
        VueRouterAutoImports,
        {
          pinia: ['defineStore', 'storeToRefs']
        }
      ],
      dts: 'src/auto-imports.d.ts',
      eslintrc: { enabled: true },
      vueTemplate: true
    }),

    // 4) Auto-Components (falls du globale Komponenten willst)
    Components({
      dts: 'src/generated/components.d.ts'
    }),

    // 5) Vue – wichtig: Cropper v2 als Custom Elements durchlassen
    Vue({
      template: {
        transformAssetUrls,
        compilerOptions: {
          // CropperJS v2 liefert Web Components: <cropper-image> etc.
          // Ohne das hier versucht Vue, die Tags als Vue-Komponenten zu behandeln -> Glitches/Zoom-Fails.
          isCustomElement: tag => tag.startsWith('cropper-')
        }
      }
    }),

    // 6) Vuetify zuletzt unter den Core-Plugins
    Vuetify({
      autoImport: true
    }),

    // 7) Fonts via fontsource
    Fonts({
      fontsource: {
        families: [
          {
            name: 'Roboto',
            weights: [100, 300, 400, 500, 700, 900],
            styles: ['normal', 'italic']
          }
        ]
      }
    }),

    // 8) Bundle Visualizer (optional, zur Analyse)
    // Öffnet den Report nicht mehr automatisch, um den Build-Fluss nicht zu stören.
    visualizer({
      open: false,
      filename: 'stats.html'
    })
  ],

  optimizeDeps: {
    // Passt so – vermeidet unnötige Prebundles bei Dev
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic'
    ]
  },

  // Use import.meta.env (no process.env shim)

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url))
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
  },

  server: {
    port: 3000
  },

  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler'
      },
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});

import path from 'node:path'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver, VantResolver } from 'unplugin-vue-components/resolvers'
import Unocss from 'unocss/vite'
import transformerVariantGroup from '@unocss/transformer-variant-group'
import transformerDirective from '@unocss/transformer-directives'
import basicSsl from '@vitejs/plugin-basic-ssl'
import Markdown from 'vite-plugin-md'
import { code, link } from 'md-powerpack'

export default defineConfig({
  base: '/documents/common-mq/',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    VueDevTools(),

    basicSsl(),

    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    Markdown({
      headEnabled: true,
      frontmatterDefaults: {
        requireAuth: false,
      },
      style: {
        baseStyle: 'none',
      },
      builders: [
        link({
          theme: 'material',
        }),
        code({
          theme: 'material',
        }),
      ],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: [
        'vue',
        'vue/macros',
        'vue-router',
        '@vueuse/core',
        {
          consola: [
            ['default', 'consola'],
          ],
        },
      ],
      dts: true,
      dirs: [
        './src/composables',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      resolvers: [ElementPlusResolver(), VantResolver()],
      dts: true,
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss({
      transformers: [
        transformerDirective(),
        transformerVariantGroup(),
      ],
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
  },

  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
})

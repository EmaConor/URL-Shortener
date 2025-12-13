// @ts-check
import path from 'node:path';

import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  site: 'https://short.emaconor.site',
  base: '/',

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },

  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
});
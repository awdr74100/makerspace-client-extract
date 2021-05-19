/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { minifyHtml, injectHtml } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    createVuePlugin(),
    minifyHtml(),
    injectHtml({
      injectData: {
        title: '特徵提取',
      },
    }),
    VitePWA({
      // mode: 'development',
      // base: '/',
      registerType: 'autoUpdate',
      manifest: {
        name: 'Extraction',
        short_name: 'Extraction',
        theme_color: '#20c997',
        start_url: '.',
        display: 'standalone',
        scope: '/',
        background_color: '#20c997',
        icons: [
          {
            src: './img/icons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './img/icons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 9000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

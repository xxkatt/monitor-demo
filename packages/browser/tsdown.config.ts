import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'browser',
  target: 'esnext',
  dts: true,
  sourcemap: true,
  clean: true,
})

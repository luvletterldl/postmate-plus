import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: false,
  clean: true,
  target: 'es2015',
  dts: true,
  // sourcemap: true,
  format: ['esm', 'cjs'],
})

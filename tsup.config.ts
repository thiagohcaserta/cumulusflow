import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
    client: 'src/client/index.ts',
    server: 'src/server/index.ts',
    edge: 'src/edge/index.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  external: ['react', 'react-dom']
});
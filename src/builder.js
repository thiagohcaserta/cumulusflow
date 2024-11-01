import { build as esbuild } from 'esbuild';
import glob from 'fast-glob';

export async function build() {
  // Find all page components and API routes
  const entries = await glob(['pages/**/*.{js,jsx}']);
  
  // Build client bundle
  await esbuild({
    entryPoints: entries.filter(e => !e.includes('api/')),
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: 'dist/client'
  });

  // Build edge functions
  await esbuild({
    entryPoints: entries.filter(e => e.includes('api/')),
    bundle: true,
    format: 'esm',
    outdir: 'dist/edge'
  });
}
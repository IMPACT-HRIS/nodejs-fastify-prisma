/* eslint-disable import/no-extraneous-dependencies */
import { NodeResolvePlugin } from '@esbuild-plugins/node-resolve'
import { analyzeMetafile, build } from 'esbuild'

const result = await build({
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  entryPoints: ['src/index.ts'],
  outfile: 'build/index.js',
  bundle: true,
  platform: 'node',
  target: ['node16'],
  minify: true,
  metafile: true,
  sourcemap: true,
  plugins: [
    NodeResolvePlugin({
      extensions: ['.ts', '.js'],
      onResolved: (resolved) => {
        if (resolved.includes('node_modules')) {
          return {
            external: true,
          }
        }
        return resolved
      },
    }),
  ],
})

const text = await analyzeMetafile(result.metafile)
console.info(text)

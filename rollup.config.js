// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/mini-router/index.js',
  output: [
    {
      file: 'dist/mini-router.esm.js',
      format: 'esm',
      sourcemap: true,
      compact: false,
      indent: true
    }
  ],
  plugins: [
    resolve(),
    commonjs()
  ]
}
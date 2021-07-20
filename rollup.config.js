import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import serve from 'rollup-plugin-serve-proxy';

const production = !process.env.ROLLUP_WATCH;

const PORT = 3001;
const BASE_SERVER_URL = 'http://localhost:3000';

export default [
  {
    input: 'src/client/vendor.js',
    output: {
      sourcemap: false,
      format: 'iife',
      name: 'vendor',
      file: 'dist/vendor.js'
    },
    plugins: [
      resolve(),
      commonjs(),
      // typescript({
      //   tsconfig: './tsconfig.svelte.json',
      //   sourceMap: !production,
      //   inlineSources: !production
      // }),
    ],
  },
  {
    input: 'src/client/index.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'dist/bundle.js'
    },
    external: ['phaser'],
    plugins: [
      svelte({
        preprocess: sveltePreprocess({sourceMap: !production}),
        compilerOptions: {
          dev: !production
        }
      }),
      css({output: 'style.css'}),
      scss({output: 'dist/global.css', watch: ['src/client/scss']}),
      resolve({
        browser: true,
        dedupe: ['svelte', 'phaser']
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.svelte.json',
        sourceMap: !production,
        inlineSources: !production
      }),

      copy({
        targets: [
          {src: ['src/client/index.html'], dest: 'dist'},
          {src: ['src/client/public/**/*'], dest: 'dist'},
          {src: ['assets/**/*',], dest: 'dist/assets'}
        ],
        copyOnce: true
      }),

      // !production && serve(),

      !production && serve({
        open: true,
        verbose: false,
        contentBase: 'dist',
        historyApiFallback: false,
        host: 'localhost',
        port: PORT,
        proxy: {
          api: BASE_SERVER_URL,
          'socket.io': BASE_SERVER_URL
        }
      }),

      !production && livereload('dist'),
      production && terser()
    ],
    watch: {
      clearScreen: false
    }
  },
];

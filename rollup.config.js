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

const production = !process.env.ROLLUP_WATCH;

const PORT = 3001;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev', `--port ${PORT}`], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    }
  };
}

export default {
  input: 'src/client/index.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'dist/bundle.js'
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({sourceMap: !production}),
      compilerOptions: {
        dev: !production
      }
    }),
    css({output: 'style.css'}),
    scss({output: 'dist/global.css'}),
    resolve({
      browser: true,
      dedupe: ['svelte']
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
      ]
    }),

    !production && serve(),
    !production && livereload('dist'),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

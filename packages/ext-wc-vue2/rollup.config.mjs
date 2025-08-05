import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = [
  'vue',
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  // JavaScript 构建
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      },
      // UMD 构建，用于直接在浏览器中使用
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'ExtWcVue2',
        exports: 'named',
        sourcemap: true,
        globals: {
          'vue': 'Vue'
        }
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  },
  // TypeScript 声明文件构建
  {
    input: 'src/index.ts',
    external,
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  }
];

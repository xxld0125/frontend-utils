import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = [
  'vue',
  '@frontendUtils/ext-core',
  '@frontendUtils/cdn-vue2'
];

/** @type {import('rollup').RollupOptions[]} */
export default [
  // JavaScript 构建
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins: [
      resolve({
        preferBuiltins: false
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

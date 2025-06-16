module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        debug: false
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: 3,
        helpers: true,
        regenerator: true
      }
    ]
  ]
};

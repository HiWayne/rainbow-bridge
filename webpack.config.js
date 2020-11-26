const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.tsx'],
    alias: {
      '~': path.resolve(__dirname, './src'),
      shared: path.resolve(__dirname, './src/shared'),
      'public.key': path.resolve(__dirname, './public.key'),
      'private.key': path.resolve(__dirname, './private.key'),
      components: path.resolve(__dirname, './src/components'),
    },
    modules: ['fs', 'path', 'node_modules'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};

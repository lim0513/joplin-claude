const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env) => {
  const isProduction = env && env.production;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.ts',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'src/manifest.json', to: '.' },
          { from: 'src/webview', to: 'webview', noErrorOnMissing: true },
          // Browser UMD build of markdown-it for the chat panel webview
          { from: 'node_modules/markdown-it/dist/markdown-it.min.js', to: 'webview/markdown-it.min.js', info: { minimized: true } },
        ],
      }),
    ],
    devtool: isProduction ? false : 'source-map',
  };
};

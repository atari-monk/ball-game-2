const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin') // Import the plugin

module.exports = {
  mode: 'development',
  entry: './src/client.ts',
  output: {
    filename: 'client.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // Configure the CopyWebpackPlugin to copy your index.html file to the build folder
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/index.html', to: 'index.html' }],
    }),
  ],
}

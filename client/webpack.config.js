const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // Import the plugin

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
      {
        test: /\.css$/, // Handle CSS files
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS to separate file
          'css-loader', // Translates CSS into CommonJS
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/index.html', to: 'index.html' }],
    }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }), // Configure the plugin for CSS
  ],
}

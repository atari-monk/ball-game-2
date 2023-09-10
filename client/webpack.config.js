const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv').config()

module.exports = (env) => {
  // Load environment variables from a .env file
  const envConfig = dotenv.parsed

  return {
    mode: 'production',
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
      new MiniCssExtractPlugin({
        filename: 'styles.css', // Specify the correct path for the extracted CSS
      }),
      // Inject environment variables into your client-side code
      new webpack.DefinePlugin({
        'process.env.HOST': JSON.stringify(envConfig?.HOST || 'azure'),
      }),
    ],
  }
}

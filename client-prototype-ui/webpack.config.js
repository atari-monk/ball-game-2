const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => {
  return {
    mode: 'development',
    devtool: false,
    entry: {
      'stacked-ui': './src/stacked-ui/index.ts',
      'stacked-ui-2': './src/stacked-ui-2/index.ts',
    },
    output: {
      filename: '[name]/index.js',
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
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]/assets/[name].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/stacked-ui/index.html', to: 'stacked-ui/index.html' },
          {
            from: 'src/stacked-ui-2/index.html',
            to: 'stacked-ui-2/index.html',
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name]/styles.css',
      }),
    ],
  }
}

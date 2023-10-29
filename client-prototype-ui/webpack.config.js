const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = () => {
  return {
    mode: 'development',
    devtool: false,
    entry: {
      '1_stacked_ui': './src/1_stacked_ui/index.ts',
      '2_stacked_ui': './src/2_stacked_ui/index.ts',
      '3_canvas-only': './src/3_canvas-only/index.ts',
      '4_mobile': './src/4_mobile/index.ts',
      '5_mobile': './src/5_mobile/index.ts',
      '6_mobile': './src/6_mobile/index.ts',
      '7_mobile': './src/7_mobile/index.ts',
      '8_mobile': './src/8_mobile/index.ts',
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
          {
            from: 'src/1_stacked_ui/index.html',
            to: '1_stacked_ui/index.html',
          },
          {
            from: 'src/2_stacked_ui/index.html',
            to: '2_stacked_ui/index.html',
          },
          {
            from: 'src/3_canvas-only/index.html',
            to: '3_canvas-only/index.html',
          },
          {
            from: 'src/4_mobile/index.html',
            to: '4_mobile/index.html',
          },
          {
            from: 'src/5_mobile/index.html',
            to: '5_mobile/index.html',
          },
          {
            from: 'src/6_mobile/index.html',
            to: '6_mobile/index.html',
          },
          {
            from: 'src/7_mobile/index.html',
            to: '7_mobile/index.html',
          },
          {
            from: 'src/8_mobile/index.html',
            to: '8_mobile/index.html',
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: '[name]/styles.css',
      }),
    ],
  }
}

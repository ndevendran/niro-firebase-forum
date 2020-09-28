const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',{'plugins': ['@babel/plugin-proposal-class-properties']}
            ]
          }
        }
      },
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader?modules=true'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|jpg|png|html|svg)$/,
        use: [
          'file-loader',
        ]
      },
    ]
  },
  plugins: [new HtmlWebpackPlugin(), new Dotenv()]
};

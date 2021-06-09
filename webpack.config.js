const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/app/index.js',
  output: {
    path: `${__dirname}/dist`, // Folder to store generated bundle
    filename: 'bundle.js', // Name of generated bundle after build
    publicPath: '/', // public URL of the output directory when referenced in a browser
  },
  module: {
    // where we defined file patterns and their loaders
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    // Array of plugins to apply to build chunk
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/public/index.html`,
      inject: 'body',
    }),
  ],
  devServer: {
    contentBase: './src/public', // source of static assets
    port: 7700, // port to run dev-server
  },
};

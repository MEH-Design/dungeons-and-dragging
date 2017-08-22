const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      // {
      //   test: /.js$/,
      //   loader: 'babel-loader',
      //   exclude: /node_modules/,
      //   include: [
      //     path.resolve(__dirname, 'src')
      //   ]
      // }
    ],
  },
};

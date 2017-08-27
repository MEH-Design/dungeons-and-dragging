const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.join(__dirname, 'docs'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', ]
  },
  module: {
    loaders: [
<<<<<<< Updated upstream
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
=======
        { test: /\.tsx?$/, loader: 'ts-loader' },
    ]
>>>>>>> Stashed changes
  },
};

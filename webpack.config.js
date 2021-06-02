let path = require('path');
let pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
let phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = {
  entry: './src/client/index.ts',
  devtool: "source-map",

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      // { test: /phaser\.js$/, loader: 'expose-loader', options: {exposes: ['Phaser']}, }
      // { test: /phaser\.js$/, use: ['expose-loader?Phaser'] }
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './src/client/'),
    publicPath: '/dist/',
    host: 'localhost',
    port: 3001,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  }
};

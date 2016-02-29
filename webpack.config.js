module.exports = {
  entry: './main.js',
  output: {
    path: './target/',
    filename: 'eyecindex.js'
  },
  devServer: {
    inline: true,
    port: 4444
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','react']
        }
      }
    ]
  }
}

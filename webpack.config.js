const { DIR, EXT = 'ts' } = process.env;

module.exports = {
  mode: 'development',
  entry: `./examples/${DIR}/main.${EXT}`,
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx?/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
        },
      }],
    }, {
      test: /\.tsx?/,
      loader: 'ts-loader',
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    port: process.env.PORT || '8080',
    contentBase: `./examples/${DIR}`,
  },
};

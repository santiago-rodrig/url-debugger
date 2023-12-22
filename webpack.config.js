const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "main-bundle.js",
    path: path.resolve(__dirname, 'bundles')
  },
  target: "node",
  mode: "production",
  externals: [webpackNodeExternals()]
}

const path = require('path')

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "url-debugger",
    path: path.resolve(__dirname, 'dist')
  },
  target: "node",
  mode: "production"
}
const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const common = require("./webpack.common");
const { resolve } = require("./utils");

module.exports = merge(common, {
  mode: "production",
  entry: "./src/main.tsx",
  devtool: "#source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.ejs",
      title: "Emilia"
    }),
    new CleanWebpackPlugin([resolve("dist/*.*")], {
      root: resolve("./")
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "emilia-report.html"
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: true,
          ecma: 5,
          mangle: true
        }
      })
    ]
  }
});

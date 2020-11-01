const webpack = require("webpack");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const common = require("./webpack.common");

const host = "127.0.0.1";
const port = "8080";

const devConfig = {
  mode: "development",
  entry: ["react-hot-loader/patch", "./src/main.tsx"],
  devtool: "cheap-eval-source-map",
  devServer: {
    quiet: true,
    compress: true,
    host,
    port,
    historyApiFallback: true,
    hot: true,
    open: false,
    overlay: true,
    watchContentBase: true,
    contentBase: "public",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081"
      },
      "/presets": {
        target: "http://127.0.0.1:8081"
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.ejs",
      title: "[DEV] Emilia"
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://${host}:${port}`]
      }
    })
  ]
};

module.exports = merge(common, devConfig);

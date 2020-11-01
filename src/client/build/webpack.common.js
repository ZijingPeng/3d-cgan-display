const process = require("process");
const path = require("path");
const TsImportPlugin = require("ts-import-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const createStyledComponentsTransformer = require("typescript-plugin-styled-components")
  .default;
const { resolve } = require("./utils");

const styledComponentsTransformer = createStyledComponentsTransformer();

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  output: {
    path: resolve("dist"),
    filename: "[name].[hash:6].js",
    chunkFilename: "[name].[hash:6].js"
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: ".",
      chunks: "async",
      minSize: 30000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        polyfills: {
          test: /polyfill-.+/,
          name: "polyfills",
          chunks: "all",
          priority: 1,
          minSize: 0
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "thread-loader" },
          { loader: "cache-loader" },
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: () => {
                const postcssSprites = require("postcss-sprites")({
                  retina: true,
                  spritePath: "./dist/",
                  filterBy: function(image) {
                    return new Promise((resolve, reject) => {
                      const prefixes = ["Yicon", "logo"];
                      for (let i = 0; i < prefixes.length; i += 1) {
                        if (path.basename(image.path).startsWith(prefixes[i])) {
                          resolve();
                          return;
                        }
                      }
                      reject();
                    });
                  }
                });
                // CSS should not be compressed in development mode.
                // So I removed cssnano in development mode.
                if (isDev) {
                  return [postcssSprites, require("autoprefixer")()];
                }
                return [
                  postcssSprites,
                  require("autoprefixer")(),
                  require("cssnano")({ preset: "default" })
                ];
              }
            }
          }
        ]
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: [
          { loader: "cache-loader" },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  styledComponentsTransformer,
                  TsImportPlugin({
                    libraryDirectory: "lib",
                    libraryName: "antd",
                    style: "css"
                  })
                ]
              })
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|ttf|woff|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "[name].[hash:6].[ext]"
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      tslint: true,
      checkSyntacticErrors: true,
      watch: ["src"]
    }),
    new CopyWebpackPlugin([{
      from: "public/*",
      to: "../dist/",
      flatten: true
    }])
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".css", ".js", ".json", ".png", ".svg"]
  },
  performance: {
    hints: false
  }
};

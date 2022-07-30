/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const EslintPlugin = require("eslint-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const baseConfig = {
  entry: path.resolve(__dirname, "./src/index"),
  mode: "development",
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      { test: /\.ts$/i,
       use: "ts-loader",
       exclude: "/node_modules/" 
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
        {
            loader: 'url-loader',
          options: {
          limit: 1000,
          name: 'img/[name].[ext]',
          }
        }
        ]
      }
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new EslintPlugin({ extensions: "ts" }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ["**/*", "!.git"],
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === "prod";
  const envConfig = isProductionMode
    ? require("./webpack.prod.config")
    : require("./webpack.dev.config");

  return merge(baseConfig, envConfig);
};

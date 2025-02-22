const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const config = {};

config.web = {
  name: "web",
  entry: "./web/index.js",
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    alias: {
      "@crypto/node-driver": path.resolve(
        __dirname,
        "./web/lib/crypto/webcrypto-driver"
      ),
    },
    fallback: {
    },
    extensions: [".ts", ".js"],
  },
  plugins: [
  ],
  output: {
    filename: "web.bundle.js",
    path: path.resolve(__dirname, "bundles"),
  },
};

config.webprod = {
  name: "web-prod",
  entry: "./web/index.js",
  mode: "production",
  target: "web",
  devServer: {
    contentBase: "./dist",
  },
  resolve: {
    alias: {
      "@crypto/node-driver": path.resolve(
        __dirname,
        "./web/lib/crypto/webcrypto-driver"
      ),
    },
    fallback: {
    },
    extensions: [".ts", ".js"],
  },
  plugins: [
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: "web.bundle.min.js",
    path: path.resolve(__dirname, "bundles"),
  },
};

config.webtests = {
  name: "web-tests",
  entry: "./test/web/web.ts",
  mode: "development",
  target: "web",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@crypto/node-driver": path.resolve(
        __dirname,
        "./web/lib/crypto/webcrypto-driver"
      ),
    },
    fallback: {
    },
  },
  plugins: [
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist",
  },
  output: {
    filename: "webtests.bundle.js",
    path: path.resolve(__dirname, "bundles"),
  },
};

module.exports = [config.web, config.webprod, config.webtests];

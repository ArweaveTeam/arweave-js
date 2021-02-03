const BabelMinify = require("babel-minify-webpack-plugin");
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
    contentBase: "./dist"
  },
  resolve: {
    alias: {
      process: "process/browser",
      crypto: "crypto-browserify",
      stream: "stream-browserify"
    },
    fallback: {
      "util": require.resolve("util"),
      "process": require.resolve("process/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
  ],
  output: {
    filename: "web.bundle.js",
    path: path.resolve(__dirname, "bundles")
  }
};

config.webprod = {
  name: "web-prod",
  entry: "./web/index.js",
  mode: "production",
  target: "web",
  devServer: {
    contentBase: "./dist"
  },
  resolve: {
    alias: {
      process: "process/browser",
      crypto: "crypto-browserify",
      stream: "stream-browserify"
    },
    fallback: {
      "util": require.resolve("util"),
      "process": require.resolve("process/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
  ],
  optimization: {
    minimizer: [new BabelMinify({ mangle: false })]
  },
  output: {
    filename: "web.bundle.min.js",
    path: path.resolve(__dirname, "bundles")
  }
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
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      process: "process/browser"
    },
    fallback: {
      "util": require.resolve("util"),
      "process": require.resolve("process/browser"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify")
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify'
    }),
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  output: {
    filename: "webtests.bundle.js",
    path: path.resolve(__dirname, "bundles")
  }
};

module.exports = [config.web, config.webprod, config.webtests];

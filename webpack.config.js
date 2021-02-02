const BabelMinify = require("babel-minify-webpack-plugin");
const path = require("path");
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
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "util": require.resolve("util")
    }
  },
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
  optimization: {
    minimizer: [new BabelMinify({ mangle: false })]
  },
  resolve: {
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "util": require.resolve("util")
    }
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
    fallback: {
      "crypto": require.resolve('crypto-browserify'),
      "util": require.resolve("util")
    }
  },
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./dist"
  },
  plugins: [],
  output: {
    filename: "webtests.bundle.js",
    path: path.resolve(__dirname, "bundles")
  }
};

module.exports = [config.web, config.webprod, config.webtests];

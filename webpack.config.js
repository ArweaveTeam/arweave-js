const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

const output = (filename) => ({
  filename,
  path: path.resolve(__dirname, "bundles"),
});

module.exports = [
  {
    name: "web",
    entry: "./web/index.js",
    mode: "development",
    target: "web",
    devtool: "inline-source-map",
    output: output("web.bundle.js"),
  },
  {
    name: "web-prod",
    entry: "./web/index.js",
    mode: "production",
    target: "web",
    optimization: { minimizer: [new TerserPlugin()] },
    output: output("web.bundle.min.js"),
  },
  {
    name: "web-tests",
    entry: "./test/web/web.ts",
    mode: "development",
    target: "web",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: "ts-loader",
          options: { configFile: "tsconfig.webtests.json" },
        },
      ],
    },
    resolve: { extensions: [".ts", ".js"] },
    output: output("webtests.bundle.js"),
  },
];

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const DotEnvPlugin = require("dotenv-webpack");
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  mode: "production",
  devtool: "source-map",
  entry: {
    main: ["./client"],
  },
  output: {
    path: path.join(__dirname, "..", "..", "dist", "bundle"),
    publicPath: "/",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: ["node_modules"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new DotEnvPlugin({
      path: `.env.${process.env.NODE_ENV}`,
      systemvars: true,
    }),
    new CopyPlugin({
      patterns: [{ from: "./static", to: "./" }],
    }),
    new ProgressBarPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  performance: {
    hints: false,
  },
  stats: "errors-only",
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  watchOptions: {
    aggregateTimeout: 0,
  },
};

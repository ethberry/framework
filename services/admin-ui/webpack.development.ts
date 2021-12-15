import path from "path";
import { Configuration } from "webpack";
import DotEnvPlugin from "dotenv-webpack";
import CopyPlugin from "copy-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import "webpack-dev-server";

const config: Configuration = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    main: ["./src"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    chunkFilename: "[id].js",
    publicPath: "/",
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
        test: /\.(ttf|woff|woff2|eot|svg|gif|png|ico)(\?.+)?$/,
        use: [
          {
            loader: "file-loader?name=[name].[ext]?[hash]",
          },
        ],
      },
      {
        test: /\.[tj]sx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers: () => ({
                before: [ReactRefreshTypeScript()],
              }),
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new DotEnvPlugin({
      path: `.env.${process.env.NODE_ENV as string}`,
      systemvars: true,
    }),
    new CopyPlugin({
      patterns: [{ from: "./static", to: "./" }],
    }),
    new ReactRefreshWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  performance: {
    hints: false,
  },
  optimization: {
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
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    port: 3002,
    historyApiFallback: {
      index: "index.html",
    },
  },
};

export default config;

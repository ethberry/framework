import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import DotEnvPlugin from "dotenv-webpack";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
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
    alias: {
      "@mui/x-license": path.join(__dirname, "node_modules/@mui/x-license"),
      ethers: path.join(__dirname, "node_modules/ethers"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: ["node_modules"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
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
    new ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
    new DotEnvPlugin({
      path: `.env.${process.env.NODE_ENV as string}`,
      systemvars: true,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CopyPlugin({
      patterns: [{ from: "./static", to: "./" }],
    }),
    new ReactRefreshWebpackPlugin({ overlay: false }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]((?!@gemunion|@mui).*)[\\/]/,
          name: "vendors",
          chunks: "all",
          enforce: true,
        },
        gemunion: {
          test: /[\\/]node_modules[\\/]@gemunion[\\/]/,
          name: "gemunion",
          chunks: "all",
          enforce: true,
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: "mui",
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  watchOptions: {
    poll: 1000,
    aggregateTimeout: 0,
    followSymlinks: true,
  },
  stats: {
    errorDetails: true,
  },
  devServer: {
    client: {
      overlay: false,
    },
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

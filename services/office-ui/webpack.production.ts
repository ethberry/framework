import path from "path";
import { Configuration, ProvidePlugin } from "webpack";
import DotEnvPlugin from "dotenv-webpack";
import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import WebpackBar from "webpackbar";

const config: Configuration = {
  mode: "production",
  devtool: "source-map",
  entry: {
    main: ["./src"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  resolve: {
    alias: {
      "@mui/x-license-pro": path.join(__dirname, "node_modules/@mui/x-license-pro"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    modules: ["node_modules"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
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
    new WebpackBar(),
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
    aggregateTimeout: 0,
  },
};

export default config;

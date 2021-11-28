import { fileURLToPath } from "url";
import path, { dirname } from "path";
import wbpk from "webpack";

const filename = fileURLToPath(import.meta.url);

const { IgnorePlugin } = wbpk;

export default {
  entry: "./src/Server.ts",
  target: "node",
  output: {
    filename: "server.js",
    path: path.resolve(dirname(filename), "build"),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
  plugins: [
    new IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  ],
};

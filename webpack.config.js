const { resolve } = require("path");
const pkg = require("./package.json");

module.exports = {
  mode: "production",

  entry: {
    loader: "./src/index.tsx"
  },

  output: {
    filename: pkg.main,
    library: "CanvasCleave",
    libraryTarget: "umd"
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "awesome-typescript-loader",
          options: {
            configFileName: "tsconfig.dist.json"
          }
        },
        exclude: resolve(__dirname, "node_modules"),
        include: resolve(__dirname, "src")
      }
    ]
  }
};

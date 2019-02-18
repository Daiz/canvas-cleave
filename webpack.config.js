const { basename, dirname, join } = require("path");
const pkg = require("./package.json");

module.exports = {
  mode: "production",
  target: "node",

  entry: {
    loader: "./src/index.tsx"
  },

  output: {
    filename: basename(pkg.main),
    libraryTarget: "commonjs2",
    path: join(__dirname, dirname(pkg.main))
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
            configFileName: "config/tsconfig.dist.json"
          }
        },
        exclude: join(__dirname, "node_modules"),
        include: join(__dirname, "src")
      }
    ]
  }
};

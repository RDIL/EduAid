module.exports = {
  presets: ["react-app"],
  plugins: [
    [
      "import",
      {
        libraryName: "@material-ui/core",
        libraryDirectory: "esm",
        camel2DashComponentName: false
      },
      "core"
    ],
    [
      "import",
      {
        libraryName: "@material-ui/icons",
        libraryDirectory: "esm",
        camel2DashComponentName: false
      },
      "icons"
    ],
    "transform-minify-booleans"
  ]
}

"use strict"

const path = require("path")
const webpack = require("webpack")
const PnpWebpackPlugin = require("pnp-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin")
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const safePostCssParser = require("postcss-safe-parser")
const ManifestPlugin = require("webpack-manifest-plugin")
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin")
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin")
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent")
const paths = require("./paths")
const modules = require("./modules")
const getClientEnvironment = require("./env")
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin")
const SriPlugin = require("webpack-subresource-integrity")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const postcssNormalize = require("postcss-normalize")

const appPackageJson = require(paths.appPackageJson)
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false"

const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
)

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/

module.exports = function(webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development"
  const isEnvProduction = webpackEnv === "production"

  const isEnvProductionProfile =
    isEnvProduction && process.argv.includes("--profile")

  const publicPath = isEnvProduction
    ? paths.servedPath
    : isEnvDevelopment && "/"
  const shouldUseRelativeAssetPaths = publicPath === "./"

  const publicUrl = isEnvProduction
    ? publicPath.slice(0, -1)
    : isEnvDevelopment && ""
  const env = getClientEnvironment(publicUrl)

  const getStyleLoaders = cssOptions =>
    [
      isEnvDevelopment && require.resolve("style-loader"),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
        options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {}
      },
      {
        loader: require.resolve("css-loader"),
        options: cssOptions
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          ident: "postcss",
          plugins: () => [
            require("postcss-flexbugs-fixes"),
            require("postcss-preset-env")({
              autoprefixer: {
                flexbox: "no-2009"
              },
              stage: 3
            }),
            postcssNormalize()
          ],
          sourceMap: false
        }
      }
    ].filter(Boolean)

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? false
      : isEnvDevelopment && "cheap-module-source-map",
    entry: [
      isEnvDevelopment &&
        require.resolve("react-dev-utils/webpackHotDevClient"),
      paths.appIndexJs
    ].filter(Boolean),
    output: {
      crossOriginLoading: "anonymous",
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      // TODO: remove this when upgrading to webpack 5
      futureEmitAssets: true,
      chunkFilename: isEnvProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : isEnvDevelopment && "static/js/[name].chunk.js",
      publicPath: publicPath,
      devtoolModuleFilenameTemplate: isEnvProduction
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, "/")
        : isEnvDevelopment &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
      jsonpFunction: `webpackJsonp${appPackageJson.name}`,
      globalObject: "this"
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // https://github.com/terser-js/terser/issues/120
              inline: 2
            },
            mangle: {
              safari10: true
            },
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          sourceMap: shouldUseSourceMap
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: false
          },
          cssProcessorPluginOptions: {
            preset: ["default", { minifyFontValues: { removeQuotes: false } }]
          }
        })
      ],
      splitChunks: {
        chunks: "all",
        name: false
      },
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`
      }
    },
    resolve: {
      modules: ["node_modules", paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
      alias: {
        "react-native": "react-native-web",
        ...(isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling"
        }),
        ...(modules.webpackAliases || {})
      },
      plugins: [
        PnpWebpackPlugin,
        new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
      ]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          parser: {
            requireEnsure: false
          }
        },
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: "pre",
          use: [
            {
              options: {
                cache: true,
                formatter: require.resolve("react-dev-utils/eslintFormatter"),
                eslintPath: require.resolve("eslint"),
                resolvePluginsRelativeTo: __dirname
              },
              loader: require.resolve("eslint-loader")
            }
          ],
          include: paths.appSrc
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve("url-loader"),
              options: {
                limit: imageInlineSizeLimit,
                name: "static/media/[name].[hash:8].[ext]"
              }
            },
            {
              test: /\.(js|mjs|jsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve(
                  "babel-preset-react-app/webpack-overrides"
                ),
                plugins: [
                  [
                    require.resolve("babel-plugin-named-asset-import"),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            "@svgr/webpack?-svgo,+titleProp,+ref![path]"
                        }
                      }
                    }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: isEnvProduction
              }
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve("babel-loader"),
              options: {
                babelrc: true,
                configFile: false,
                compact: false,
                presets: [
                  [
                    require.resolve("babel-preset-react-app/dependencies"),
                    { helpers: true }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: false,
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap
              }
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: false
              }),
              sideEffects: true
            },
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: false,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent
                }
              })
            },
            {
              loader: require.resolve("file-loader"),
              exclude: [/\.(js|mjs|jsx)$/, /\.html$/, /\.json$/],
              options: {
                name: "static/media/[name].[hash:8].[ext]"
              }
            }
            // Make sure to add new loader(s) before the "file" loader.
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appHtml
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true
                }
              }
            : undefined
        )
      ),
      isEnvProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new ModuleNotFoundPlugin(paths.appPath),
      new webpack.DefinePlugin(env.stringified),
      new webpack.DefinePlugin({
        "process.env.BACKEND_SERVER": JSON.stringify(process.env.BACKEND_SERVER)
      }),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: "static/css/[name].[contenthash:8].css",
          chunkFilename: "static/css/[name].[contenthash:8].chunk.css"
        }),
      new ManifestPlugin({
        fileName: "asset-manifest.json",
        publicPath: publicPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path
            return manifest
          }, seed)

          return {
            files: manifestFiles,
            entrypoints: entrypoints.main
          }
        }
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new SriPlugin({
        hashFuncNames: ["sha256", "sha384"],
        enabled: isEnvProduction
      }),
      new ProgressBarPlugin({
        summary: false,
        width: 50
      })
    ].filter(Boolean),
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      module: "empty",
      dgram: "empty",
      dns: "mock",
      fs: "empty",
      http2: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty"
    },
    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false
  }
}

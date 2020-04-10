"use strict"

const fs = require("fs")
const path = require("path")
const paths = require("./paths")

function getAdditionalModulePaths(options = {}) {
  const baseUrl = options.baseUrl

  if (baseUrl == null) {
    const nodePath = process.env.NODE_PATH || ""
    return nodePath.split(path.delimiter).filter(Boolean)
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl)

  if (path.relative(paths.appNodeModules, baseUrlResolved) === "") {
    return null
  }

  if (path.relative(paths.appSrc, baseUrlResolved) === "") {
    return [paths.appSrc]
  }

  if (path.relative(paths.appPath, baseUrlResolved) === "") {
    return null
  }
}

function getWebpackAliases(options = {}) {
  const baseUrl = options.baseUrl

  if (!baseUrl) {
    return {}
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl)

  if (path.relative(paths.appPath, baseUrlResolved) === "") {
    return {
      src: paths.appSrc
    }
  }
}

function getModules() {
  const hasJsConfig = fs.existsSync(paths.appJsConfig)

  let config

  if (hasJsConfig) {
    config = require(paths.appJsConfig)
  }

  config = config || {}
  const options = config.compilerOptions || {}

  const additionalModulePaths = getAdditionalModulePaths(options)

  return {
    additionalModulePaths: additionalModulePaths,
    webpackAliases: getWebpackAliases(options)
  }
}

module.exports = getModules()

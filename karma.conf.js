const { chromium, firefox, webkit } = require("playwright");
Object.assign(process.env, {
  CHROME_BIN: chromium.executablePath(),
  CHROMIUM_BIN: chromium.executablePath(),
  FIREFOX_BIN: firefox.executablePath(),
  WEBKIT_BIN: webkit.executablePath(),
  WEBKIT_HEADLESS_BIN: webkit.executablePath(),
});

const coverageReporters = [];
if (process.env.KARMA_COVERAGE) {
  const types = process.env.KARMA_COVERAGE.split(",");
  if (types.indexOf("json") >= 0) coverageReporters.push({ type: "json" });
  if (types.indexOf("lcov") >= 0) coverageReporters.push({ type: "lcov" });
  if (types.indexOf("text") >= 0) coverageReporters.push({ type: "text" });
}

const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
webpackConfig.mode = "none";
webpackConfig.plugins.push(new webpack.EnvironmentPlugin({ NODE_ENV: "test" }));
if (process.env.KARMA_COVERAGE) {
  webpackConfig.module.rules.push({
    enforce: "post",
    exclude:
      /node_modules|\.contract\.\w+$|\.error\.\w+$|\.test\.\w+$|index\.\w+$/,
    loader: "@jsdevtools/coverage-istanbul-loader",
    options: { esModules: true },
    test: /\.[cm]?[jt]sx?$/,
  });
}

module.exports = function (karmaConfig) {
  karmaConfig.set({
    autoWatch: false,
    basePath: process.cwd(),
    coverageReporter: {
      dir: "coverage",
      reporters: coverageReporters,
      subdir: (browserName) => browserName.toLowerCase().split(/[ /-]/)[0],
    },
    failOnEmptyTestSuite: false,
    failOnSkippedTests: false,
    failOnFailingTestSuite: true,
    files: [{ pattern: "source/index.test.*", watched: false }],
    frameworks: ["mocha", "webpack"],
    hostname: "127.0.0.1",
    listenAddress: "0.0.0.0",
    logLevel: karmaConfig.LOG_ERROR,
    mochaReporter: { output: "minimal" },
    plugins: [
      "karma-chrome-launcher",
      "karma-coverage",
      "karma-firefox-launcher",
      "karma-mocha",
      "karma-mocha-reporter",
      "karma-sourcemap-loader",
      "karma-webkit-launcher",
      "karma-webpack",
    ],
    port: 9876,
    preprocessors: { "**/*": ["webpack", "sourcemap"] },
    reporters: process.env.KARMA_COVERAGE ? ["mocha", "coverage"] : ["mocha"],
    singleRun: true,
    webpack: webpackConfig,
  });
};

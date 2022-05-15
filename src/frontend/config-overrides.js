const webpack = require("webpack");

module.exports = {
  // The Webpack config to use when compiling your react app for development or production.
  webpack: function (config, env) {
    const overridedConfig = {
      ...config,
      ignoreWarnings: [/Failed to parse source map/],
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.m?js/,
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      resolve: {
        ...config.resolve,
        extensions: [".ts", ".js"],
        fallback: {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          stream: require.resolve("stream-browserify"),
          crypto: require.resolve("crypto-browserify"),
          http: require.resolve("stream-http"),
          https: require.resolve("https-browserify"),
          os: require.resolve("os-browserify/browser"),
          url: require.resolve("url"),
          buffer: require.resolve("buffer/"),
        },
      },
      plugins: [
        ...config.plugins,
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ],
    };
    return overridedConfig;
  },
};

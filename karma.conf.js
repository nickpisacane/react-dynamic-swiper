const path = require('path')

module.exports = function (config) {
  config.set({
    basePath: '',
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha'],
    files: [
      'test/**/*.test.js'
    ],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: {
        alias: {
          'swiper': path.resolve(__dirname, 'node_modules/swiper/dist/js/swiper.js')
        }
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015',
                'react',
                'stage-0'
              ],
              plugins: [
                'transform-object-assign'
              ]
            }
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    },
    reporters: ['nyan'],
    nyanReporter: {
      suppressErrorHighlighting: true
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true
  })

  if (process.env.WATCH) {
    config.set({
      autoWatch: true,
      singleRun: false
    })
  }
}

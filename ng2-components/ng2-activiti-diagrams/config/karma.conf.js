var webpackConfig = require('./webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine-ajax', 'jasmine'],

        files: [
          { pattern: './config/karma-test-shim.js', watched: false },
          'node_modules/chart.js/dist/Chart.js',
          'node_modules/raphael/raphael.js',
        ],

        preprocessors: {
            './config/karma-test-shim.js': ['webpack', 'sourcemap'],
            './src/**/!(*spec).js': ['coverage']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['mocha', 'karma-remap-istanbul', 'karma-remap-istanbul'],
        remapIstanbulReporter: {
            remapOptions: {}, //additional remap options
            reportOptions: {}, //additional report options
            reports: {
                'html': './coverage',
                // 'text-summary': null, // to show summary in console
                'lcovonly': './coverage/lcov.info'
            }
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    };

    config.set(_config);
};

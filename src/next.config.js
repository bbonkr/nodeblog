const webpack = require('webpack');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = withBundleAnalyzer({
    analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
    analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
        server: {
            analyzerMode: 'static',
            reportFilename: 'bundles/server.html',
        },
        browser: {
            analyzerMode: 'static',
            reportFilename: 'bundles/client.html',
        },
    },
    distDir: '.next',
    webpack(config) {
        // console.log('config', config);
        const prod = process.env.NODE_ENV === 'production';

        if (prod) {
            config.plugins.push(new CompressionPlugin());
        }

        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval',
            plugins: [
                ...config.plugins,
                new webpack.ContextReplacementPlugin(
                    /moment[/\\]locale$/,
                    /ko/,
                ),
            ],
        };
    },
});

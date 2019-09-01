const webpack = require('webpack');
const dotenv = require('dotenv');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const CompressionPlugin = require('compression-webpack-plugin');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');

dotenv.config();

function HACK_removeMinimizeOptionFromCssLoaders(config) {
    console.warn(
        'HACK: Removing `minimize` option from `css-loader` entries in Webpack config',
    );
    config.module.rules.forEach(rule => {
        if (Array.isArray(rule.use)) {
            rule.use.forEach(u => {
                if (u.loader === 'css-loader' && u.options) {
                    delete u.options.minimize;
                }
            });
        }
    });
}

module.exports = withBundleAnalyzer(
    withCSS(
        withSass({
            env:{
                apiBaseUrl: process.env.API_BASE_URL,
            },
            distDir: '.next',
            webpack(config) {
                const prod = process.env.NODE_ENV === 'production';

                const plugins = [
                    ...config.plugins,
                    new webpack.ContextReplacementPlugin(
                        /moment[/\\]locale$/,
                        /^\.\/ko$/,
                    ),
                ];

                if (prod) {
                    plugins.push(new CompressionPlugin());
                }

                // config.module.rules.push({
                //     test: /\.css$/,
                //     loader: ['style-loader', 'css-loader', 'sass-loader'],
                // });
                // console.log(config);
                HACK_removeMinimizeOptionFromCssLoaders(config);

                return {
                    ...config,
                    mode: prod ? 'production' : 'development',
                    devtool: prod ? 'hidden-source-map' : 'eval',
                    module: {
                        ...config.module,
                        rules: [
                            ...config.module.rules,
                            {
                                loader: 'webpack-ant-icon-loader',
                                enforce: 'pre',
                                include: [
                                    require.resolve(
                                        '@ant-design/icons/lib/dist',
                                    ),
                                ],
                            },
                        ],
                    },
                    plugins: plugins,
                };
            },
        }),
    ),
);

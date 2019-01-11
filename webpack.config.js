const path = require('path');
const config = {};

config.web = {
    name: 'web',
    entry: './src/web.ts',
    mode: 'development',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [],
    output: {
        filename: 'web.bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};

config.webprod = {
    name: 'web-prod',
    entry: './src/web.ts',
    mode: 'production',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [],
    output: {
        filename: 'web.bundle.min.js',
        path: path.resolve(__dirname, 'dist')
    }
};

config.webtests = {
    name: 'web-tests',
    entry: './test/web/web.ts',
    mode: 'development',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    plugins: [
    ],
    output: {
        filename: 'webtests.bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};

module.exports = [config.web, config.webprod, config.webtests];

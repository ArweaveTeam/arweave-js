const path = require('path');
const webpack = require("webpack");

const config = {};

config.node = {
    name: 'node',
    entry: './src/node.ts',
    mode: 'development',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
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
        filename: 'node.bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
};

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

module.exports = [config.node, config.web, config.webprod];
const path = require('path');

const config = {};

config.node = {
    name: 'node',
    entry: './src/arweave/node/index.ts',
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
    entry: './src/arweave/web/index.ts',
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

module.exports = [config.node, config.web];
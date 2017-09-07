const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const utils = require('./webpack.config.utils');

const port = {
    web: 89,
    was: 8080
};

const pages = [{
    html: 'index',
    script: 'main',
}, {
    html: 'sub',
    script: 'sub',
}, {
    html: 'best',
    script: 'best',
}, {
    html: 'admin/index',
    script: 'admin/main',
}, {
    html: 'admin/makers-list',
    script: 'admin/makers-list',
}, {
    html: 'admin/makers-info-edit',
    script: 'admin/makers-info-edit',
}];

module.exports = {
    entry: utils.getEntry(pages),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: './js/[name].[chunkhash].bundle.js'
    },
    module: {
        rules: [{
            test: /\.less$/,
            use: ExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, {
                    loader: 'less-loader'
                }]
            }),
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ExtractTextWebpackPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }]
            })
        }, {
            test: /\.hbs$/,
            loader: 'handlebars-loader',
            query: {
                helperDirs: path.resolve(__dirname, 'src/template/helpers')
            }
        }]
    },
    devServer: {
        contentBase: './dist',
        port: port.web,
        proxy: {
            '/chi_makers/api': 'http://localhost:' + port.was
        }
    },
    plugins: utils.getPlugins(pages)
};
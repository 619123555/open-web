import pathConfig from "./src/pathConfig"
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
/*const CompressionPlugin = require("compression-webpack-plugin");*/
const BabiliPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        app: __dirname + "/src/main.js",
        vendor: ['jquery', 'react', 'antd', __dirname + "/src/utils/fetch.js"]
    },
    output: {
        path: __dirname + pathConfig.PROJECTNAME,//打包后的文件存放的地方
        publicPath: "./",
        filename: "js/[name]-[hash].js",//打包后输出文件的文件名
        chunkFilename: 'js/[name].[chunkhash:5].chunk.js'
    },
    resolve: {
        alias: {
            src:path.resolve(__dirname,"src/"),
            components:path.resolve(__dirname,"src/components/"),
            css:path.resolve(__dirname,"src/css/"),
            features:path.resolve(__dirname,"src/features/"),
            utils:path.resolve(__dirname,"src/utils/"),
            images:path.resolve(__dirname,"src/images/"),
        }
    },
    module: {
        loaders: [
            {test: /\.json$/, loader: "json"},
            {test: /\.js$/, exclude: /node_modules/, loader: "babel"},
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css!postcss")},
            {test: /\.(png|jpg|gif)\w*/, loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'},
            {test: /\.(eot|svg|ttf|woff|woff2)/, loader: 'file?name=fonts/[hash].[ext]'}
        ]
    },
    postcss: [
        require('autoprefixer')
    ],
    plugins: [
        new ExtractTextPlugin("css/[name]-[hash].css"),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
            React: "react",
        }),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'js/[name]-[hash].js'),
        new HtmlWebpackPlugin({
            template: 'index.html.template',
            title: pathConfig.WEBTITLE,
            favicon: path.resolve(__dirname, 'src/images/favicon.ico'),
            hash: true,
            minify: {removeComments: true, collapseWhitespace: true},
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin(),
        new BabiliPlugin(),
        /*new CompressionPlugin({
         asset: "[path].gz[query]",
         algorithm: "gzip",
         test: /\.js$|\.css$|\.html$/,
         threshold: 10240,
         minRatio: 0,
         deleteOriginalAssets:true,
         }),*/
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            },
        }),
    ]
};

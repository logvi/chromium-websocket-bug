const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HTML = require('html-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const srcPath = path.resolve(__dirname, 'frontend', 'src');
const out = path.join(__dirname, 'frontend', 'dist');
const jsPath = path.join(srcPath, 'js');
const stylePath = path.join(srcPath, 'styles');
const imgPath = path.join(srcPath, 'img');
const fontsPath = path.join(srcPath, 'fonts');

let config = {
    entry: {
        app: jsPath + '/script.js',
        vendor: ['socket.io-client']
    },
    devtool: 'source-map',
    output: {
        path: out,
        filename: 'js/[name].bundle.js',
        sourceMapFilename: '[file].map',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: jsPath,
                loader: 'babel-loader',
                options: {
                    plugins: ['transform-decorators-legacy', 'transform-runtime'],
                    presets: [
                        'es2015',
                        'stage-1']
                }
            },
            {
                test: /\.scss$/,
                include: stylePath,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!postcss-loader!sass-loader'
                })
            },
            {
                test: /\.png$/,
                include: imgPath,
                loader: 'url-loader?limit=15000&mimetype=image/png&name=img/[name].[ext]'
            },
            {
                test: /\.jpg$/,
                include: imgPath,
                loader: 'file-loader?name=img/[name].[ext]'
            },
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
                include: fontsPath,
                loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        // split vendor chunks
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),

        new HTML({
            template: srcPath + '/views/index.ejs',
            filename: 'index.html',
            inject: false,
            minJS: production ? '.min' : '',
            hash: true
        }),

        new HTML({
            template: srcPath + '/views/noinput.ejs',
            filename: 'noinput.html',
            inject: false,
            minJS: production ? '.min' : '',
            hash: true
        }),

        // build css into separate file
        new ExtractTextPlugin({
            filename: 'style/main.css',
            allChunks: true
        }),

        // postcss config
        new webpack.LoaderOptionsPlugin({
            cache: true,
            options: {
                postcss: [
                    require('autoprefixer')({
                        browsers: ['last 3 version']
                    })
                ]
            }
        }),

        new webpack.DefinePlugin({
            __DEV__: process.env.NODE_ENV !== 'production',
            __PRODUCTION__: process.env.NODE_ENV === 'production',
            __TEST__: JSON.stringify(process.env.TEST || false),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
    ]
};

module.exports = config;
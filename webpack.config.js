const webpack = require('webpack');
const path = require('path');

module.exports = {
    /*...*/

    devtool: "source-map",
    context: __dirname ,
    entry: {
        index: ["babel-polyfill","./src/Gob_webpack_lib.js"],
    },
    output: {
        library: 'GobLib',
        libraryTarget: 'umd',
        path: __dirname + "/bin/",
        filename: "Gob.webpack.js",

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin("UI-DNA By nullce - nullice.com - ui@nullice.com\n"+"这些代码由 Webpack2 打包生成，查看源代码请到 https://github.com/nullice/Gob"),
    ],
};










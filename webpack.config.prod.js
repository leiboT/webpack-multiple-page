const path = require("path");
// 引入基础配置
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
// 引入 webpack
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 清理 dist 文件夹
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 合并配置文件
module.exports = webpackMerge(webpackBase,{
    plugins:[
        // 自动清理 dist 文件夹
        new CleanWebpackPlugin(

            ['dist'],　 //匹配删除的文件
            {
                root: __dirname,       　　　　　　　　　　//根目录
                verbose:  true,        　　　　　　　　　　//开启在控制台输出信息
                dry:      false        　　　　　　　　　　//启用删除文件
            }),
        // 代码压缩
        //new webpack.optimize.UglifyJsPlugin(),
        // 提取公共 css
        // new webpack.optimize.CommonsChunkPlugin({
        //     // chunk 名为 commons
        //     name: "commons",
        //     minChunks: function (module, count) {
        //         const resource = module.resource;
        //         // 以 .css 结尾的资源，重复 require 大于 1 次
        //         return resource && /\.css$/.test(resource) && count > 1
        //     }
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     // chunk 名为 commons
        //     name: "commons",
        //     minChunks: function (module, count) {
        //         const resource = module.resource;
        //         // 以 .js 结尾的资源，重复 require 大于 1 次
        //         return resource && /\.js$/.test(resource) && count > 1
        //     }
        // }),
        // 提取第三方库
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/css'),
                to: 'css',
                ignore: ['.*']
            }
        ])
    ]
});
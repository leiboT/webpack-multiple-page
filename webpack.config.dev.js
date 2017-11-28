const webpack = require("webpack");
// 引入基础配置文件
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
// 合并配置文件
module.exports = webpackMerge(webpackBase,{
    devtool: "eval-source-map",
    // 配置 webpack-dev-server
    devServer:{
        // 项目根目录
        contentBase: './dist',
        //hot: true,
        //historyApiFallback: true,//所有的跳转都将指向index.html
        inline: true//源文件改变刷新页面
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
    // module: {
    //     rules: [
    //         {
    //             test: /\.js$/,
    //             // 强制先进行 ESLint 检查
    //             enforce: "pre",
    //             // 不对 node_modules 和 lib 文件夹中的代码进行检查
    //             exclude: /node_modules|lib/,
    //             loader: "eslint-loader",
    //             options: {
    //                 // 启用自动修复
    //                 fix: true,
    //                 // 启用警告信息
    //                 emitWarning: true,
    //             }
    //         },
    //     ]
    // },
});
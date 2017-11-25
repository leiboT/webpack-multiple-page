const path = require("path");
// 引入基础配置文件
const webpackBase = require("./webpack.config.base");
// 引入 webpack-merge 插件
const webpackMerge = require("webpack-merge");
// 合并配置文件
module.exports = webpackMerge(webpackBase,{
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
    // 配置 webpack-dev-server
    devServer:{
        // 项目根目录
        contentBase: path.join(__dirname, "../dist"),
        compress: true,
        // 错误、警告展示设置
        overlay:{
            errors:true,
            warnings:true
        },
        //historyApiFallback: true,//所有的跳转都将指向index.html
        inline: true//源文件改变刷新页面
    }
});
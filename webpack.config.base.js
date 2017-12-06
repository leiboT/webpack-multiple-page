const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
// 引入插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 抽取 css
const ExtractTextPlugin = require("extract-text-webpack-plugin");
//路径定义
let srcDir = __dirname + "/src";
// 入口文件集合 调用entries函数即可
let entries= function () {
    let jsDir = srcDir + "/js";
    let entryFiles = glob.sync(jsDir + '/*.{js,jsx}');
    let map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
};

//html_webpack_plugins 定义
let html_plugins = function () {
    let entryHtml = glob.sync(srcDir + '/*.html')
    let r = []
    let entriesFiles = entries()
    for (let i = 0; i < entryHtml.length; i++) {
        let filePath = entryHtml[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: 'html-withimg-loader!' + path.resolve(srcDir, filePath),
            filename: filename + '.html',
            favicon: './favicon.ico',
        }
        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body';
            conf.chunks = ['vendor', filename]
        }
        //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
        //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
        r.push(new HtmlWebpackPlugin(conf))
    }
    return r
}

// let maps = entries();
// for(let page in maps){
//     if(page === 'index'){
//         const htmlPlugin = new HTMLWebpackPlugin({
//             filename: 'index.html',
//             template: path.resolve(__dirname, '../src/index.html'),
//             inject : 'body',
//             chunks : ['vendor', 'index'],
//         });
//         HTMLPlugins.push(htmlPlugin);
//     }else{
//         const htmlPlugin = new HTMLWebpackPlugin({
//             filename: `html/${page}.html`,
//             template: path.resolve(__dirname, `../src/html/${page}.html`),
//             inject : 'body',
//             chunks: ['vendor', page]
//         });
//         HTMLPlugins.push(htmlPlugin);
//     }
// }
let plugin = [];
plugin.push(
    // 将 样式 抽取到某个文件夹
    new ExtractTextPlugin({
        filename: 'css/[name].[hash].css'
    }),
    new webpack.ProvidePlugin({
        $:"jquery",
        jQuery:"jquery",
        "window.jQuery":"jquery"
    })
);

// 获取环境命令，并去除首尾空格
const env = process.env.NODE_ENV.replace(/(\s*$)|(^\s*)/ig,"");

module.exports = {
    //entry: entries(),
    entry: Object.assign(entries(), {'vendor': ['jquery','bootstrap']}),
    output: {
        filename: "js/[name].[hash].js",
        path: __dirname + "/dist",
        publicPath: env === 'dev' ? 'http://localhost:8080/' : '/resume/',
        chunkFilename: "[name].[chunkHash:8].js",
    },
    // 加载器
    module: {
        rules: [
            {
                // 对 css 后缀名进行处理
                test: /\.css$/,
                // 不处理 node_modules 文件中的 css 文件
                exclude: /node_modules/,
                // 抽取 css 文件到单独的文件夹
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    // 设置 css 的 publicPath
                    //publicPath: config.cssPublicPath,
                    use:
                        [
                            {
                                loader: "css-loader",
                                options: {
                                    //modules: true,
                                    // 开启 css 压缩
                                    minimize: true,
                                }
                            },
                            {
                            loader: "postcss-loader",
                            }
                        ]
                })
            },
            {
                test: /\.stylus$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:
                        [
                            {
                                loader: "css-loader",
                                options: {
                                    //modules: true,
                                    // 开启 css 压缩
                                    minimize: true,
                                }
                            },
                            {
                                loader: "postcss-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            {
                                loader: "stylus-loader",
                            }
                        ]
                })
            },
            {
                test:  /\.js$/,
                exclude: /node_modules|lib/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)(\?.*)?$/,
                exclude: /fonts/,
                use:{
                    loader: "url-loader",
                    options:{
                        limit: 10000,
                        name: path.posix.join('img/[name].[hash:7].[ext]')
                    }
                }
                // use:{
                //     loader:"file-loader",
                //     options:{
                //         // 打包生成图片的名字
                //         name:"[name].[ext]",
                //         // 图片的生成路径
                //         outputPath: 'img/'
                //     }
                // }
            },
            {
                //test: /\.(eot|svg|ttf|woff|woff2)\$/,
                test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
                use:{
                    loader: "url-loader",
                    options:{
                        limit: 10000,
                        name: path.posix.join('fonts/[name].[hash:7].[ext]')
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join('media/[name].[ext]')
                }
            },
        ],
    },
    resolve: {
        extensions: [ '.js', '.css', '.stylus', '.tpl', '.png', '.jpg'],
        alias: {
            "bootstrap": path.join(srcDir, 'js/lib/bootstrap.js'),
            "jquery": path.join(srcDir, 'js/lib/jquery-1.12.4.js'),
        }
    },
    plugins: plugin.concat(html_plugins())
};
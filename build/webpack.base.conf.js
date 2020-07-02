const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        filename: 'js/[name].[hash:8].js',
        path: resolve(__dirname, '../dist'),
        // pubilcPath: ''
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|styl(us))$/,
                use: [
                     // vue-style-loader会应用到普通的 `.css` 文件，以及 `.vue` 文件中的 `<style>` 块
                    isDev ? 'vue-style-loader' : {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 当修改了 MiniCssExtractPlugin 中的 CSS 文件生成路径，也需要修改这里的 publicPath 路径
                            // 不然会导致打包后，CSS文件中 background url 属性的图片路径引用不正确而显示不出来
                            publicPath: '../',
                            // hmr: isDev, // 仅dev环境启用HMR功能，需要结合css-hot-loader，但貌似没作用？
                        }
                    },
                    'css-loader',
                    'stylus-loader',
                    'postcss-loader'
                ]
            },
            {
                //图片解析
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 8, // 当图片大于8k时，交给file-loader处理，否则url-loader会把图片src转成base64编码
                        name: '[name].[hash:8].[ext]',
                        outputPath: 'images',
                        esModule: false // 新版file-loader使用了ES Module模块化方式，将esModule配置为false就可以解决html页面中图片解析地址不正确问题
                    }
                }]
            },
            {
                //字体解析
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                //解析 html中的图片资源
                test: /\.(html|htm)$/,
                use: [{
                    loader: 'html-withimg-loader',
                    options: {
                        outputPath: 'images'
                    }
                }]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: resolve(__dirname, '../index.html')
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[id].[hash:8].css'
        })
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue'] // 引入依赖或者文件的时候可以省略后缀
    },
    devtool: 'source-map'
}
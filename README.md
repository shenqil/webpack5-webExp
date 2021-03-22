# webpack5-webExp
使用webpack5搭建一个前端项目

# 1. 创建工程
## 1.1 运行`npm init -y` 创建工程

## 1.2.创建 `webpack.common.js` `webpack.dev.js` `webpack.prod.js` 三个webpack配置文件
+ `webpack.common.js` 公共配置
+ `webpack.dev.js` 调试环境配置
+ `webpack.prod.js` 生产环境配置

## 1.3.`npm i webpack webpack-cli -D`  安装webpack 

## 1.4. `npm i webpack-merge webpack-dev-server -D` 安装webpack合并和调试工具
***

# 2.处理html资源
## 2.1 创建 `index.html`
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div class="box">
        <div class="content">
            德玛西亚，永不退缩
            <i class="iconfont icon-xiazai"></i>
            <img src="./src/assets/img/1.jpg">
            <img src="./src/assets/img/2.jpg">
        </div>
    </div>

    <img src="./src/assets/img/2.jpg" alt="">
</body>

<script src="./src/main.js" type="moudule"></script>

</html>
```
## 2.2 `npm i html-webpack-plugin -D` 安装html插件
```
 // webpack.common.js

const HtmlWebpackPlugin = require('html-webpack-plugin'); 

    plugins: [
        new HtmlWebpackPlugin({ template: "./index.html" }),
    ],
```

## 2.3 `npm i html-loader -D` 处理html里面的静态资源
```
 // webpack.common.js

    module: {
        rules: [
            {
                test: /\.html$/i,
                // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
                loader: "html-loader",
            },
        ]
    }
```
***

# 3.处理ts

## 3.1 安装ts-loader  `npm i ts-loader  typescript -D`
```
 // webpack.common.js

            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
```

## 3.2 `tsc --init` 创建 **tsconfig.json**

## 3.3 创建main.ts文件
```
import { add } from './assets/js/test'
import './assets/font/iconfont.css'
import './assets/css/index.scss'

add(1, 2)
    .then(res => {
        console.log(res, 'add');
    })
```
***

# 4. 处理sass

## 4.1 安装 css-loader `npm install --save-dev style-loader css-loader`
## 4.2 安装 sass-loader  `npm install --save-dev sass sass-loader `
## 4.3 安装css 压缩抽离 `npm i mini-css-extract-plugin -D`
## 4.4 配置测试环境
```
// webpack.dev.js

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    'sass-loader'
                ]
            }
        ]
    },
});
```

## 4.5 配置生产环境
```
//  webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: '[id].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../',
                        },
                    },
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    "css-loader",
                    'sass-loader'
                ],
            },
        ]
    },
});
```

## 4.6 创建index.scss
```
// index.scss
$body-color: red;

*{
    margin: 0;
    padding: 0;
}
.box{
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    background-color: $body-color;
    background:no-repeat url('../img/1.jpg') ;
    .content{
        width: 600px;
        height: 600px;
        background-color: pink;
        img{
            width: 100px;
            height: 100px;
        }
    }
}
```
***

# 5.拆分所有chunks
```
// webpack.common.js

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
```
***

# 6. 省略后缀名
```
// webpack.common.js

    resolve: {
        // 配置省略文件路径的后缀名
        extensions: ['.tsx', '.ts', '.js'],
    }
```
***

# 7.处理静态资源
```
// webpack.common.js

            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[hash][ext][query]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/font/[hash][ext][query]'
                }
            },
```

# 8.测试环境配置  **devServer**

```
// webpack.dev.js

    devServer: {
        contentBase: './dist',
        // 启动gzip 压缩
        compress: true,
        // 端口号
        port: 8080,
        open: true,
        hot: true,
    },
```

# 9.生产环境每次编译清除dist文件夹 ` npm i clean-webpack-plugin -D`
```
// webpack.prod.js

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

    plugins: [
        new CleanWebpackPlugin(),
    ],
```

# 10.修改`package.json`
```
  "scripts": {
    "test": "webpack --config webpack.dev.js",
    "start": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
```

[源码](https://github.com/fssqLove/webpack5-webExp)

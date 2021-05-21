# webpack5 使用 postcss

## 1.克隆一份 [webpack5 创建前端代码](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2FfssqLove%2Fwebpack5-webExp)

## 2.安装 postcss-loader postcss-preset-env

- postcss-loader 作为`webpack` loader 放在 `css-loader`前面用来处理 css
- postcss-preset-env 是 `postcss-loader`的插件

```
npm i  postcss-loader postcss-preset-env -D
```

## 3.新建 `postcss.conﬁg.js` 用来配置 postcss-loader

```
module.exports = {
    plugins: [
        require('postcss-preset-env')
    ]
}
```

## 4.安装`cross-env` 用来设置 node 环境变量

```
npm i cross-env -D
```

## 5.配置 webpack 使用 `postcss-loader`

```
// webpack.prod.js

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
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ],
            },
        ]
    },
```

## 6.修改 `index.scss` 增加一些 cs3 样式

```
// src\assets\css\index.scss


html,
body {
  color: lch(53 105 40);
  display: flex;
  backface-visibility: hidden;
}

:fullscreen {
  width: auto;
}
```

## 7.修改 `package.json` 告诉 `postcss 打包规则`

```
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js"
  },
  "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ]
  }
```

- `cross-env NODE_ENV=production` 设置 node 环境变量 为 `production`
- `browserslist` 里分别设置 `development`和`production`里面需要支持的浏览器

## 8. 执行`npm run build`

```
html,
body {
  color: rgb(250, 0, 4);
  display: flex;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
:-webkit-full-screen {
  width: auto;
}
:-ms-fullscreen {
  width: auto;
}
:fullscreen {
  width: auto;
}
```

- ` color: lch(53 105 40);`被处理成 ` color: rgb(250, 0, 4);`
- `backface-visibility: hidden;` 会加上前缀
- `:fullscreen ` 也会做处理

## 9.问题

- **display: flex;** 没有处理为`display: -webkit-flex;`

[源码](https://github.com/fssqLove/webpack5-webExp/tree/postcss)

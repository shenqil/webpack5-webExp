# Loader 初体验

## 1.创建一个loader,用于把`.txt`文件内容中的`[name]`,替换

```
// loader\index.js

export default function loader(source) {
  const options = this.getOptions();

  // eslint-disable-next-line no-param-reassign
  source = source.replace(/\[name\]/g, options.name);

  return `export default ${JSON.stringify(source)}`;
}
```

+ source是传入的文件内容

***

## 2.创建一个用于测试的文件

```
// test\example.txt
Hey [name]!
```

***

## 3.使用webpack结合loader,编译`.txt`测试文件

+ `npm install --save-dev memfs` 将compiler的结果放在内存中，用于测试

```
// test\compiler.js

import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: path.resolve(__dirname, '../loader/index.js'),
            options,
          },
        },
      ],
    },
  });

  compiler.outputFileSystem = createFsFromVolume(new Volume());
  compiler.outputFileSystem.join = path.join.bind(path);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(stats.toJson().errors);

      resolve(stats);
    });
  });
};
```

***

## 4.使用`jest`编译测试文件验证编译结果

+ `npm install --save-dev jest babel-jest @babel/core @babel/preset-env`

```
// test\loader.test.js
import compiler from './compiler.js';

// eslint-disable-next-line no-undef
test('Inserts name and outputs JavaScript', async () => {
  const stats = await compiler('example.txt', { name: 'Alice' });
  const output = stats.toJson({ source: true }).modules[0].source;

  console.log(output, stats.toJson());
  // eslint-disable-next-line no-undef
  expect(output).toBe('export default "Hey Alice!\\n"');
});
```

***
[源码](https://github.com/shenqil/webpack5-webExp/tree/loader)

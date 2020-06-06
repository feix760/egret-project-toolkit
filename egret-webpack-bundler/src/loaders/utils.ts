import * as webpack from 'webpack';

// 添加automatically头
export function generateContent(content: string) {
  return `// This file is automatically generated by build\n${content}`;
}

// stringify之后用这个 更新require语句
export function unescapeRequire(content: string) {
  return content.replace(/"__(require|asset)\(([^"]+)\)"/g, (all, cmd, p) => {
    if (cmd === 'require') {
      return `require("${p}")`;
    } else if (cmd === 'asset') {
      return `__webpack_public_path__ + "${p}"`;
    }
    return all;
  });
}

// 读取stream
// export function readStream(stream) {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     stream
//       .on('error', reject)
//       .on('data', chunk => {
//         chunks.push(chunk);
//       })
//       .on('end', () => {
//         resolve(Buffer.concat(chunks));
//       });
//   });
// }

// math匹配
// export function isMatch(fileName, matchList) {
//   if (!Array.isArray(matchList)) {
//     matchList = [matchList];
//   }
//   let included = false;
//   let excluded = false;
//   matchList.forEach(match => {
//     if (match.startsWith('!')) {
//       if (minimatch(fileName, match.slice(1))) {
//         excluded = true;
//       }
//     } else {
//       if (minimatch(fileName, match)) {
//         included = true;
//       }
//     }
//   });
//   return included && !excluded;
// }

// 添加watch ignore
export function addWatchIgnore(compiler: webpack.Compiler, ignored: string) {
  const options = compiler.options as webpack.Configuration & { devServer: any };
  // console.log(compiler.options)
  const watchOptions = options.watchOptions
    || (options.devServer && options.devServer.watchOptions)
    || {};

  if (!watchOptions.ignored) {
    watchOptions.ignored = [];
  } else if (!Array.isArray(watchOptions.ignored)) {
    watchOptions.ignored = [watchOptions.ignored];
  }
  watchOptions.ignored.push(ignored);

  options.watchOptions = watchOptions;
  // options.devServer.watchOptions = watchOptions;
}

// 向compilation添加一个asset
// export function addAssetToCompilation(compilation, fileName, content, outFileName) {
//   const { context } = compilation.compiler;
//   const publicName = loaderUtils.interpolateName(
//     {
//       resourcePath: path.join(context, fileName),
//     },
//     outFileName,
//     {
//       content,
//       context,
//     }
//   );
//   compilation.assets[publicName] = {
//     size() {
//       return content.length;
//     },
//     source() {
//       return content;
//     },
//   };
//   return publicName.replace(/\\/g, '/');
// }

// // 获取资源的key名
// export function getRESKey(fileName) {
//   return path.basename(fileName).replace(/\./g, '_');
// }

// // 判断文件是否是webpack构建的entry
// export function isEntry(entries, resourcePath) {
//   return Object.values(entries).some((item: any) => {
//     if (!Array.isArray(item)) {
//       item = [item];
//     }
//     return item.some(p => p.replace(/^.*!/, '') === resourcePath);
//   });
// }

// // 判断是否需要热更新
// export function isHot(compiler) {
//   const { mode, devServer } = compiler.options;
//   return mode === 'development' && devServer && devServer.hot;
// }

// // 获取相对路径
// // eg: src/Main.ts src/common/Component.ts => ./common/Component.ts
// export function relative(parent, relative) {
//   if (path.isAbsolute(relative)) {
//     relative = path.relative(path.dirname(parent), relative).replace(/\\/g, '/');

//     if (!/^[\.\/]/.test(relative)) {
//       relative = `./${relative}`;
//     }
//   }
//   return relative;
// }

// // 同步timestamps
// // 同时清除inputFileSystem缓存
export function updateFileTimestamps(compiler: webpack.Compiler, filePath: string) {
  // 清除inputFileSystem缓存
  (compiler.inputFileSystem as any).purge(filePath);

  if (compiler.fileTimestamps.get(filePath)) {
    const stat = compiler.inputFileSystem.statSync(filePath);
    compiler.fileTimestamps.set(filePath, +stat.mtime);
  }
}
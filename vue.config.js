// vue-config.js
const path = require('path');
module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH,
  // 修改 src 目录 为 examples 目录
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',   // 把src 修改为examples
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html'
    },
  },
  lintOnSave: process.env.NODE_ENV === 'development',
  configureWebpack: {
    resolve: {
      extensions: [".js", ".vue", ".json", ".css"],
      alias: {
        '@': path.join(__dirname, 'src')
      }
    },
  },
  // 扩展 webpack 配置，使 packages 加入编译
  /* chainWebpack 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。 */
  chainWebpack: config => {
    config.module
        .rule('js')
        .include
        .add(__dirname + 'comp')  // 注意这里需要绝对路径，所有要拼接__dirname
        .end()
        .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        }).end()
   /* config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .options({
        prefix: false,
      })
      .end()*/
  }
};

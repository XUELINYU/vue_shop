// 这是项目发布阶段需要用到的 babel 插件
// 开发阶段  ->  vue-cli-service serve --mode development --dashboard
// 打包发布  ->  vue-cli-service build --mode production --target app --dashboard
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')// 打包文件后去掉所有的console
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件数组
    ...prodPlugins,
    // 实现路由懒加载
    "@babel/plugin-syntax-dynamic-import"
  ]
}

module.exports = {
    chainWebpack: config => {
        // 发布模式的打包入口
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')

            // cdn 方式引入资源
            config.set('externals', {
                vue:'Vue',
                // 'vue-router':'vueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })

            // 自定义 title
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式的打包入口
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')

            // 自定义 title
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}
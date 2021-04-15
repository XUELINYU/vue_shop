const express = require('express')
const compression = require('compression')

// 创建服务器
const app = express()

app.use(compression())  // 开启 gzip 压缩
app.use(express.static('./dist'))  // 托管静态资源

// 启动 web 服务器
app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
})
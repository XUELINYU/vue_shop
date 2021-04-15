import Vue from 'vue'
import App from './App.vue'
import router from './router/'
// import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器及样式
import VueQuillEditor from 'vue-quill-editor'

// 导入 nprogress 包js和css
import NProgress from 'nprogress'

import axios from 'axios'
// 配置请求的根路径
// http://timemeetyou.com:8889/api/private/v1     有角色权限
// http://server.sineava.top/api/private/v1
// https://www.liulongbin.top:8888/api/private/v1 无角色权限
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1" // wang/123123
// axios 请求拦截器
// 在 request 拦截器显示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config);
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 最后必须 return config
  return config;
})
// 在 response 拦截器隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

// 挂载到原型对象上
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 注册为全局组件 tree-table
Vue.component('tree-table', TreeTable)

// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

// 注册全局过滤器 dataFormat
Vue.filter('dataFormat', originVal => {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  // padStart 不足两位用 0 进行填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0') 
  const d = (dt.getDate() +  '').padStart(2, '0')

  const hh = (dt.getHours() +  '').padStart(2, '0')
  const mm = (dt.getMinutes() +  '').padStart(2, '0')
  const ss = (dt.getSeconds() +  '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`// yyyy-mm-dd hh-mm-ss
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

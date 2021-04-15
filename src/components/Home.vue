<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/ali.jpg" alt />
        <span>{{msg}}</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapce">|||</div>
        <!-- 侧边栏菜单 -->
        <!-- 
          unique-opened 是否只保持一个子菜单的展开(默认: false)
          collapse 是否水平折叠收起菜单(默认: false)
          collapse-transition 是否开启折叠动画(默认: true)
          router 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转(默认: false)
          default-active 当前激活菜单的 index(默认: string)
        -->
        <el-menu
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409efe"
        >
          <!-- 1级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 1级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 2级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="SaveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      msg: '米斯特王后台管理系统',
      menuList: [],
      iconList: {
        // 自定义图标  -> id: 类名
        '125': 'el-icon-user',
        '103': 'el-icon-setting',
        '101': 'el-icon-goods',
        '102': 'el-icon-present',
        '145': 'el-icon-time'
      },
      isCollapse: false, // 是否折叠菜单
      activePath: '' // 被激活的链接地址
    }
  },
  created() {
    this.getMenuList(),
      // 将保存在 sessionStorage 中的值赋值给 activePath
      (this.activePath = window.sessionStorage.getItem('activePath'))
  },
  methods: {
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      // promise 函数可以用 async 和 await 来简化操作
      const { data: res } = await this.$axios.get('/menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      // console.log(res)
    },
    // 点击按钮切换菜单的折叠和展开
    toggleCollapce() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    SaveNavState(activePath) {
      // 保存当前的路由地址
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  div {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background: #333744;
  .el-menu {
    border: none;
  }
}
.el-main {
  background: #eaedf1;
}
.toggle-button {
  background: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 25px;
  letter-spacing: 0.2em;
  color: #fff;
  cursor: pointer;
}
</style>

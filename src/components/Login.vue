<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/ali.jpg" alt />
      </div>

      <!-- element-ui 表单 -->
      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮, 重置登录表单
    resetLogin() {
      //   console.log(this);
      this.$refs.loginRef.resetFields()
    },
    // 对整个表单进行校验
    login() {
      this.$refs.loginRef.validate(async valid => {
        // console.log(valid);
        // 验证失败不发请求
        if (!valid) return
        // 如果某个方法的返回值是 promise, 可以用 await 来简化操作
        // await 只能用于被 async 修饰的方法中
        const { data: res } = await this.$axios.post('/login', this.loginForm) // 参数: username password
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // this.$loading.service({ fullscreen: true })

        // const result = await this.$axios.post('login', this.loginForm);// 参数: username password
        // console.log(result);// Promise

        // 1. 将登录成功之后的 token, 保存到客户端的 sessionStorage 中
        //    1.1 项目中除了登录之外的其他 API 接口, 必须在登录之后才能访问
        //    1.2 token 只应在当前网站打开期间生效, 所以将 token 保存在 sessionStorage 中
        // console.log(res);
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转后台主页, 路由地址: /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  overflow: hidden;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;

  img {
    width: 100%;
    height: 100%;
    background: #eee;
    border-radius: 50%;
  }
}
.login_form {
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  position: absolute;
  bottom: 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>

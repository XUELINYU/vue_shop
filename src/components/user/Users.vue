<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 栅格布局 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- 搜索与添加 -->
          <!-- 
            clearable 清空的输入框
            clear     在点击由 clearable 属性生成的清空按钮时触发
          -->
          <el-input placeholder="请输入内容" @clear="getUserList" clearable v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <!-- 
          border 表格边框
          stripe 隔行变色
      -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 通过作用域插槽接收数据, 然后通过 scope.row 拿到一行的数据 -->
          <template v-slot="scope">
            <!-- {{scope.row}} -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- slot-scope 已废弃 -->
          <!-- <template slot-scope="scope"><template> -->
          <template v-slot="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <!-- 提示信息 -->
            <el-tooltip
              effect="dark"
              :enterable="false"
              content="分配角色"
              placement="top"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
            <!-- {{scope.row}} -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 
        注意:
          表单的验证规则以 rules 结尾
          表单的引用以 ref 结尾
      -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <!-- {{editForm}} -->
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>
          分配新角色:
          <!-- 
            :value="item.id"  选中的值
           -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- selectedRoleId:{{selectedRoleId}} -->
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示条数
      },
      userList: [], // 用户信息列表
      total: 0, // 总数据条数
      addDialogVisible: false, // 控制添加用户对话框的显示与隐藏
      addForm: {
        // 添加用户表单数据
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        // 添加表单的验证规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false, // 控制修改用户对话框的显示与隐藏
      editForm: {}, // 查询到的用户信息对象
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      setRoleDialogVisible: false, // 控制分配角色对话框的显示与隐藏
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色 id 值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      // 通过结构赋值数据只显示 data 对象部分
      const { data: res } = await this.$axios.get('/users', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error('数据异常', res.mata.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      //   console.log(newSize)
      this.queryInfo.pagesize = newSize
      // 每页数据改变需要重新发起数据请求
      this.getUserList()
    },
    // 监听页码值改变事件
    handleCurrentChange(newPage) {
      //   console.log(newPage)
      // 每页数据改变需要重新发起数据请求
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      // 修改用户的状态
      const { data: res } = await this.$axios.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        // 还原操作
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error('更新用户状态失败！', res.meta.msg)
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // ref 应用
      // resetFields 表单的提供的方法
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        // 校验失败不添加
        if (!valid) return
        // 可以发起添加用户的网络请求
        // 返回 promise 简化操作可以用 async 和 await
        const { data: res } = await this.$axios.post('/users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get('/users/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      // 将查询到的保存在 editForm 中
      this.editForm = res.data
      this.editDialogVisible = true
      // console.log(id)
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(valid => {
        // console.log(valid)
        // 校验失败不修改
        if (!valid) return
        // 发起修改用户信息的数据请求
        this.$axios
          .put('/users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(res => {
            console.log(res)
            if (res.status == 200) {
              // 关闭对话框
              this.editDialogVisible = false
              // 刷新数据
              this.getUserList()
              // 提示修改成功
              this.$message.success('更新用户信息成功')
            }
          })
          .catch(err => {
            this.$message.error('更新用户信息失败')
          })
      })
    },
    // 根据 id 删除用户信息
    async removeUserById(id) {
      // console.log(id)
      // 是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err) // 解决取消报错问题
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消删除, 则返回值为字符串 cancal
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发起删除请求的操作
      const { data: res } = await this.$axios.delete('/users/' + id)
      // console.log('确认删除')
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户数百')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    },
    // 显示分配角色的对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 在展示对话框之前获取所有角色列表
      const { data: res } = await this.$axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      console.log(res.data)
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo(){
      // 没有选中要分配的角色
      if(!this.selectedRoleId){
        return this.$message.error("请选择要分配的角色")
      }
      const {data:res} = await this.$axios.put(`/users/${this.userInfo.id}/role`, {rid: this.selectedRoleId})
      // console.log(res)
      if(res.meta.status !== 200){
        return this.$message.error("更新用户角色失败！")
      }
      console.log(res)
      this.$message.success("更新用户角色成功！")
      // 刷新列表
      this.getUserList()
      // 关闭角色对话框
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed(){
      this.selectedRoleId = ""
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
</style>
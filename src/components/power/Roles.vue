<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0?'bdtop':'', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0?'':'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{scope.row}}</pre> -->
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop width="285">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 
        树形控件 
        show-checkbox         前面带复选框
        accordion             手风琴模式
        node-key              每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        default-expand-all    是否默认展开所有节点
        default-checked-keys  默认勾选的节点的 key 的数组
      -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [], // 所有角色列表数据
      setRightDialogVisible: false, // 控制分配权限对话框的显示隐藏
      rightsList: [], // 所有权限的数据
      treeProps: {
        // 树形控件的属性绑定对象
        children: 'children',
        label: 'authName'
      },
      defkeys: [], // 默认选中的节点 id 值的数据
      roleId: '' // 当前即将分配权限的角色 id
    }
  },
  created() {
    this.getrolesList()
  },
  methods: {
    //   获取所有角色列表
    async getrolesList() {
      const { data: res } = await this.$axios.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.roleList = res.data
      // console.log(this.roleList)
    },
    // 根据 id 删除对应的权限
    // 形参: 角色id 权限id
    async removeRightById(role, rightId) {
      // 弹框提示是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      // console.log('确认删除！')
      const { data: res } = await this.$axios.delete(
        `/roles/${role.id}/rights/${rightId}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      this.$message.success('删除权限成功！')

      // 将服务器返回的最新的权限直接给 children 不会出现重新绘制整个页面
      role.children = res.data

      // 会重新渲染整个页面(不建议)
      // this.getrolesList()
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      // 当前角色的 id
      // console.log(role.id);
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$axios.get('/rights/tree')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 保存数据到 rightsList 中
      this.rightsList = res.data

      // 递归获取三级节点的 id
      this.getLeafKeys(role, this.defkeys)

      this.setRightDialogVisible = true
    },
    // 通过递归的形式, 获取角色下所有三级权限的 id, 并保存到 defkeys 中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children属性, 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 关闭对话框, 清空 defkeys
    setRightDialogClosed() {
      this.defkeys.length = 0
    },
    // 点击为角色分配权限
    async allotRights() {
      // getCheckedKeys     若节点可被选择(即 show-checkbox 为 true),则返回目前被选中的节点的 key 所组成的数组
      // getHalfCheckedKeys 若节点可被选择(即 show-checkbox 为 true),则返回目前半选中的节点的 key 所组成的数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(",")
      const {data:res} = await this.$axios.post(`/roles/${this.roleId}/rights`, {rids: idStr})
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      // 刷新列表
      this.getrolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
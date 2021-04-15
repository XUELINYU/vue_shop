# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

+ 前端项目地址：http://shop.liulongbin.top/
+ 后端接口地址：https://www.liulongbin.top:8888/api/private/v1
+ 接口列表
    |接口名称|请求路径|请求方式|参数名|参数说明|参数备注|
    |---|---|:---:|---|---:|---:|
    |登录|/login|post|username<br>password|用户名<br>密码|String|
    |目录菜单|/menus|get|——|——|——|
    |用户列表|/users|get|query<br>pagenum<br>pagesize|查询参数<br>当前页码<br>每页显示条数|String<br>Number<br>Number|
    |修改状态|/users/:uId/state/:type|put|uId<br>type|用户ID<br>用户状态|不能为空<kbd>携带在url中</kbd><br>不能为空<kbd>携带在url中</kbd>(boolean)|
    |添加用户|/users|post|username<br>password<br>email<br>mobile|用户名<br>用户密码<br>邮箱<br>手机号|不能为空<br>不能为空<br>可以为空<br>可以为空|
    |根据id查询<br>用户信息|/users/:id|get|id|用户ID|不能为空<kbd>携带在url中</kbd>|
    |编辑用户<br>提交|/users/:id|put|id<br>email<br>mobile|用户ID<br>邮箱<br>手机号|不能为空<kbd>参数是url携带:id</kbd><br>可以为空<br>可以为空|
    |删除单个<br>用户|/users/:id|delete|id|用户ID|不能为空<kbd>参数是url携带:id</kbd>|
    |所有权限<br>列表|/rights/:type|get|type|类型|值 list 或 tree, list列表显示权限,<br>tree树状显示权限<kbd>参数是url携带:type</kbd>|
    |所有角色<br>列表|/roles|get|——|——|——|
    |删除角色<br>指定权限|/roles/:roleld/rights/:rightld|delete|roleld<br>rightld|角色ID<br>权限ID|不能为空<kbd>携带在url中</kbd><br>不能为空<kbd>携带在url中</kbd>|
    |所有权限<br>列表|/rights/:type|get|type|类型|值 list 或 tree, list列表显示权限,<br>tree树状显示权限<kbd>参数是url携带:type</kbd>|
    |角色授权|/roles/:roleld/rights|post|:roleld<br>rids|角色ID<br>权限ID列表(String)|不能为空<kbd>携带在url中</kbd><br>以<kbd>,</kbd>分割的权限ID列表<br>(获取所有被选中、叶子节点的key<br>和半选中节点的key,包括1,2,3级节点)|
    |分配用户<br>角色|/users/:id/role|put|id<br>rid|用户ID<br>角色ID|不能为空<kbd>参数携带在url中:id</kbd><br>不能为空<kbd>新的参数id</kbd>|
    |商品分类<br>数据列表|/categories|get|type<br>pagenum<br>pagesize|[1,2,3]<br>当前页码值<br>每页显示多少条数据|值1,2,3分别表示显示一层二层三层分类列表<br>【可选参数】如果不传递,则默认获取所有级别分类<br>【可选参数】如果不传递,则默认获取所有分类<br>【可选参数】如果不传递,则默认获取所有分类|
    |添加分类|/categories|post|cat_id<br>cat_name<br>cat_level|分类父ID<br>分类名称<br>分类层级|不能为空,如果添加1级分类,则父类分类id应该设置<kbd>0</kbd><br>不能为空<br>不能为空,<kbd>0</kbd>表示一级,<kbd>1</kbd>表示二级,<kbd>2</kbd>表示三级|

+ vue-cil3 运行报错 --- warnings potentially fixable with the `--fix` option
    + 方法一: 将package.json文件中："lint": "vue-cli-service lint" 修改为：eslint --fix --ext .js,.vue src

    + 方法二: 在.eslintrc.js文件中找到’@vue/standard’配置将其删除或注释

    + 方法三: 给编辑器里装一个eslint 插件

    + 方法四: 不安装eslint

+ 解决 eslint 语法规范问题
    + 1. 创建 .prettierrc 文件 (针对 .vue 文件)
        + 编写内容为 { "semi": false, "singleQuote": true } -> 去掉" ; ", 设置" ' "
    + 2. 修改 .eslintrc.js 文件
        + 在 "rules" 中配置 "'space-before-function-paren': 0" -> 忽略代码前空格产生的警告

+ git 基础命令
    + git checkout -b '子分支'      // 新建子分支并且切换到子分支

    + git status                    // 查看状态
    + git add .                     // 提交所有内容到暂存区
    + git commit -m '修改内容'       // 提交代码
    + git branch                    // 查看所有分支
    + git checkout master           // 切换到 master 分支
    + git merge '子分支'             // 将子分支合并到 master 分支
    + git push                      // 提交 master 分支

    + git checkout '子分支'         // 切换到子分支
    + git push -u origin "子分支"   // 第一次提交子分支, 执行此命令, 将子分支推送到码云
    + git push origin test:test     // 提交本地test分支作为远程的test分支

    + 删除分支操作
    + 先切换到别的分支  git checkout master
    + 删除本地分支      git branch -d 'del分支'
    + 强制删除分支      git branch -D 'del分支'
    + 删除远程分支      git push origin --delete 'del分支'

+ 页面优化
+ eslint 的语法规范
    + 格式化代码不换行  ->  "printWidth": 200     (.prettierrc)   

+ 打包错误处理(build)
    + 打包文件后去掉所有的console的插件  ->  babel-plugin-transform-remove-console     (在babel.config.js)

+ 修改 webgpack 的默认配置
    + vue-cli 3.0 工具生成的项目默认隐藏了所有的 webpack 的配置项, 可以通过 vue.config.js 修改
    + 通过 chainWebpack 自定义打包入口
    + 通过 externals 加载外部 CDN 资源
    + 路由懒加载
        + 1)安装 @babel/plugin-syntax-dynamic-import包
        + 2)babel.config.js配置文件中声明该插件
        + 3)将路由改为按需加载的形式
        > const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue') 

        > const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue') 
        
        > const Baz = () => import(/* webpackChunkName: "group-boo" */ './Baz.vue') 



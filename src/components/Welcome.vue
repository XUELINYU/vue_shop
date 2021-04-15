<template>
  <div class="welcome">
      <h3>Welcome</h3>
      <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  data(){
    return{
      msg:'米斯特王后台管理系统'
    }
  }
}
</script>

<style lang="less" scoped>
.welcome{
  text-align: center;
  line-height: 60px;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.welcome h3{
  font-size: 60px;
  margin: 0;
  padding: 0;
  color: royalblue;
}
.welcome p{
  margin: 0;
  padding: 0;
  font-size: 36px;
  color: gray;
}
</style>
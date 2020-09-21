<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>友情连接</b>
        &#12288;
        <i class="layui-icon layui-icon-link"></i>
      </div>
      <div class="tag-div">
        <el-link type="info">微博热搜</el-link>
        <el-link type="info">百度一下</el-link>
        <el-link type="info">爱奇艺</el-link>
        <el-link type="info">淘宝</el-link>
        <el-link type="info">天猫</el-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
<style  scoped>
.tag-div > .el-link {
  margin: 5px;
}
</style>

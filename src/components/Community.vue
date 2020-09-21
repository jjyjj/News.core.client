<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>社区交流</b>
        &#12288;
        <i class="el-icon-connection" style="font-size: 20px;"></i>
      </div>
      <div class="demo-image__placeholder">
        <div class="block">
          <el-image :src="src"></el-image>
        </div>
      </div>
      <br />
      <p style="color:#666;margin:0 auto;text-align:center">扫码加入社区交流群</p>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return { src: require("@/assets/image/shequ.jpg") };
  },
};
</script>
<style  scoped>
</style>

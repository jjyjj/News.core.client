<template>
  <div>
    <div>
      <el-card class="box-card" shadow="never">
        <div class="empty">
          <div class="ss">
            <el-image style :src="url" fit="fill"></el-image>
            <br />
            <br />
            <b >暂无数据</b>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
      url: require("@/assets/image/empty.png"),
    };
  },
};
</script>
<style  scoped>
.empty {
  height: 300px;
}
.ss {
  margin: 0 auto;
  height: auto;
  width: 200px;
  margin-top: 20px;
  text-align-last: justify;
}
</style>

<template>
  <div>
    <div>
      <el-carousel
        :interval="4000"
        type="card"
        height="200px"
        @change="((pre, next) => {change(pre, next)})"
      >
        <el-carousel-item v-for="(img,index) in lunBoList" :key="index">
        
          <el-image style="width: 100%; height: 100%" :src="getImg(img.url)" fit="fit"></el-image>
          <h3 class="medium">{{ img.url }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userId: parseInt(sessionStorage.getItem("userId")),
      //查询参数
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },
      lunBoList: [],
      url: "http://localhost:8510/",
    };
  },
  created() {
    
  },
  methods: {
    async getAllImgsByUserId(lunBoListLength) {
      const { data: res } = await this.$http.get(
        `Imgs/GetAllByUserId?userId=${this.userId}&&lunBoListLength=${lunBoListLength}`,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取我的相册失败");
      this.lunBoList = res.data;

      console.log(this.lunBoList);
    },
    getImg(url) {
      return this.url + url;
    },
    change(pre, next) {
      console.log();
    },
  },
};
</script>
<style  scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
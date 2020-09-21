<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div>
        <el-row>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-image class="imgInfo" :src="getImg(userInfo.imgUrl)" fit="fit"></el-image>
            </div>
          </el-col>
          <el-col :span="16" :offset="1">
            <div class="grid-content bg-purple-light">
              <ul>
                <li>
                  <b>{{userInfo.name}}</b>
                </li>
                <li>{{getTime(userInfo.createTime)}}成为本站写手</li>
                <li>
                  <el-link :underline="false" @click>关注他</el-link>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <ul>
                <li>1</li>
                <li>关注</li>
              </ul>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <ul>
                <li>1</li>
                <li>粉丝</li>
              </ul>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <ul>
                <li>{{commentCount}}</li>
                <li>评论</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import Bus from "../../assets/bus.js";
export default {
  components: {},

  inject: ["reload"],
  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 5,
      },
      userInfo: [],
      commentCount: 0,
      userId: this.$route.query.uId,
      url: "http://localhost:8510/",
    };
  },
  created() {
    this.getData();
    this.GetUserInfo();
  },
  computed: {},
  methods: {
    //初始化数据
    async GetUserInfo() {
      const { data: res } = await this.$http.get(
        "User/GetOneById?userId=" + this.userId
      );
      if (res.code !== 200) return this.$message.error("获取用户信息失败");
      console.table(res.data);
      this.userInfo = res.data;
    },
    //互粉
    async addFans(fansId) {
      const { data: res } = await this.$http.post(
        `Focus/add?userId=` + this.userId + `&focusId=` + fansId + ``
      );
      if (res.code !== 200) return this.$message.error(res.msg);
      else this.$message.success(res.msg);
    },
    //获得数据
    getData() {
      Bus.$on("commentCount", (data) => {
        this.commentCount = data;
      });
    },
    getImg(url) {
      return this.url + url;
    },
    getTime(val) {
      let days = this.$moment(
        this.$moment(val).format("YYYYMMDD"),
        "YYYYMMDD"
      ).fromNow();
      return days;
    },
  },
  mounted() {},
  computed: {
    commentCount() {},
  },
};
</script>
<style  scoped>
.el-col > div > ul > li {
  margin-top: 5px;
}
.imgInfo {
  width: 60px;
  height: 70px;
  border-radius: 60%;
}
</style>

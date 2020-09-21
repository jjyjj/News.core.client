<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <b>
          <span>我的粉丝</span>
        </b>
        <b style="float:right">
          <span>共有{{this.total}}人</span>
        </b>
      </div>
      <div v-if="this.focusList.length>0">
        <div v-for="item in this.focusList" :key="item.id">
          <el-card class="box-card" shadow="hover" style="margin-bottom:10px">
            <el-row :gutter="20">
              <el-col :span="2">
                <div @click="goMyArticle(item.focus.userId)" class="grid-content bg-purple">
                  <el-avatar  style="width:50px;height:50px;  cursor: pointer;" :src="getImg(item.users.imgUrl)"></el-avatar>
                </div>
              </el-col>
              <el-col :span="18">
                <ul>
                  <li>{{item.users.name}}</li>
                  <li style="margin-top:5px">
                    <span>他从</span>
                    <b>{{$moment(item.focus.createTime).format("YYYY年MM月DD日")}}</b>
                    <span>
                      开始关注你，距今已经
                      <b>{{days(item.focus.createTime)}}</b> 天
                    </span>
                  </li>
                </ul>
              </el-col>
              <el-col :span="4">
                <div class="grid-content bg-purple">
                
                  <el-button @click="addFans(item.focus.userId)">互粉</el-button>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
      <Empty v-else />
      <!-- 粉丝列表 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryModel.pageIndex"
        :page-sizes="[2,4,8]"
        :page-size="queryModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 分页区域 -->
  </div>
</template>

<script>
import Empty from "@/components/Empty.vue";
export default {
  components: { Empty },
  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 5,
      },
      total: 0,
      focusList: [],
      userId: sessionStorage.getItem("userId"),
      type: false,
      url: "http://localhost:8510/",
    };
  },
  created() {},
  methods: {
    async getFocusList() {
      const { data: res } = await this.$http.get(
        `Focus/GetAllById?userId=` + this.userId + `&type=` + this.type + ``,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取数据失败");
      this.focusList = res.data.data;
      this.total = res.data.dataCount;
      this.$message.success("获取数据成功");
    },

    //互粉
    async addFans(fansId) {
      const { data: res } = await this.$http.post(
        `Focus/add?userId=` + this.userId + `&focusId=` + fansId + ``
      );
      if (res.code !== 200) return this.$message.error(res.msg);
      else this.$message.success(res.msg);
    },
    days(val) {
      let days = this.$moment(this.$moment(new Date()).format("L")).diff(
        this.$moment(val).format("L"),
        "days"
      );
      return days;
    },
    getImg(url) {
      return this.url + url;
    },
    goMyArticle(uId) {
      let routeUrl = this.$router.resolve({
        path: "/myArticles",
        query: { uId: uId },
      });

      window.open(routeUrl.href, "_blank");
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;
      this.getFocusList();
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getFocusList();
    },
  },
};
</script>
<style  scoped>
.black {
  min-height: 150px;

}
</style>

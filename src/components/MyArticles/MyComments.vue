<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>最新评论</b>&#12288;
        <i class="el-icon-chat-dot-round" style="font-size: 20px;"></i>
      </div>
      <div v-if="commentsList.length>0">
        <ul class v-for="item in this.commentsList" :key="item.id">
          <li>
            <div>
              <el-row>
                <el-col :span="2">
                  <div class="grid-content bg-purple">
                    <i class="el-icon-caret-right" style></i>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="grid-content bg-purple">
                    <el-button @click="goDetails(item.news.id)" type="text" style="padding-top:0px">
                      <span>{{item.news.title|strFilter(10)}}</span>
                    </el-button>
                    <!-- { -->
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="grid-content bg-purple">
                    <el-button
                      disabled
                      style="padding-top:0px"
                      type="text"
                      size="small"
                    >{{item.news.createTime|dateFilter("YYYY-MM-DD ")}}</el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <Empty />
      </div>
    </el-card>
  </div>
</template>

<script>
import Bus from "../../assets/bus.js";
import Empty from "../../components/Empty";
export default {
  components: { Empty },

  inject: ["reload"],
  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 5,
      },
      commentsList: [],
      userId: this.$route.query.uId,
    };
  },
  created() {
    this.getAllByUserId();
  },
  computed: {},
  methods: {
    //初始化数据
    //获取评论列表
    async getAllByUserId() {
      const { data: res } = await this.$http.get(
        "Comment/getAllByUserId?userId=" + this.userId,
        {
          params: this.queryModel,
        }
      );

      if (res.code !== 200) return this.$message.error("获取评论失败");

      this.commentsList = res.data.data;
      Bus.$emit("commentCount", res.data.data.length);
    },
    goDetails(newsId) {
      this.$router.push("NewsDetails?newsId=" + newsId);
      this.reload();
    },
  },
  mounted() {},
};
</script>
<style  scoped>
.hotComment > li {
  margin-top: 9.4px;
}
</style>

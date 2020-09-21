<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>近期热议</b>&#12288;
        <i class="layui-icon layui-icon-fire" style="font-size: 20px;color:red"></i>
      </div>
      <div v-if="hotCommentNewsList.length>0">
        <ul class="hotComment" v-for="item in this.hotCommentNewsList" :key="item.id">
          <li>
            <el-row>
              <el-col :span="2">
                <div class="grid-content bg-purple">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="grid-content bg-purple">
                  <el-badge
                    :value="item.commentCount==0?'':item.commentCount"
                    :max="99"
                    class="item"
                  >
                    <el-button
                      @click="goDetails(item.id)"
                      type="text"
                      size="small"
                      style="padding-top:0px"
                    >{{item.news.title|strFilter(10)}}</el-button>
                  </el-badge>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content bg-purple">
                  <el-button
                    disabled
                    style="padding-top:0px"
                    type="text"
                    size="small"
                  >{{$moment(item.news.createTime).format("YYYY-MM-DD")}}</el-button>
                </div>
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
      <div v-else><Empty/></div>
    </el-card>
  </div>
</template>

<script>
import Empty from "../components/Empty";
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
      hotCommentNewsList: [],
    };
  },
  created() {
    this.getHotCommentNewsList();
  },
  computed: {},
  methods: {
    //初始化数据
    async getHotCommentNewsList() {
      const { data: res } = await this.$http.get("News/HotCommentNews", {
        params: this.queryModel,
      });
      if (res.code !== 200) return this.$message.error("获取热议文章失败");

      this.hotCommentNewsList = res.data.data;
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

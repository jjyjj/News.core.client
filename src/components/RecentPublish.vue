<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>近期发布</b>&#12288;
        <i class="el-icon-edit" style="font-size: 20px;"></i>
      </div>
      <div v-if="RecentPublishNewsList.length>0">
        <ul class v-for="item in this.RecentPublishNewsList" :key="item.id">
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
import Empty from "../components/Empty";
export default {
  components: { Empty },

  inject: ["reload"],

  data() {
    return {
      RecentPublishNewsList: [],
    };
  },
  created() {},
  computed: {},
  methods: {
    //初始化数据
    async getRecentPublishNewsList(id) {
      const { data: res } = await this.$http.get(
        "News/GetAllByUserId?userId=" + id
      );
      if (res.code !== 200) return this.$message.error("获取近期文章失败");

      this.RecentPublishNewsList = res.data.data;
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
</style>

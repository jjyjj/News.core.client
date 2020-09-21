<template>
  <div>
    <div class="grid-content bg-purple">
      <el-card class="box-card" shadow="never"></el-card>
    </div>
    <div v-if="articlesList.length>0">
      <div
      
        class="grid-content bg-purple"
        style="margin-top:8px;"
        v-for="(article ,index) in articlesList"
        :key="index"
      >
        <el-card class="box-card " shadow="never">
          <el-row>
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-image
                  style="width: 120px; height: 120px"
                  :src="getImg(article.news.imgPath)"
                  fit="fit"
                ></el-image>
              </div>
            </el-col>
            <el-col :span="19">
              <div class="grid-content bg-purple-light" style>
                <b>{{article.news.title|strFilter(10)}}</b>

                <div class="cardContent" v-html="article.news.content.substring(0,150)+`...`"></div>

                <div class="cardFoot">
                  <div>
                    <span
                      class="el-icon-time"
                    >：{{article.news.createTime|dateFilter("YYYY-MM-DD ")}}</span>
                    <span
                      class="el-icon-view"
                      style="margin:0 20px 0 10px"
                    >：{{article.news.browseCOunt}}</span>
                    <el-tag 
                      type="success"
                      style="font-size:10px"
                      v-for="(cate,index) in article.categories"
                      :key="index"
                    >{{cate.name}}</el-tag>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
      </div>
      <div v-else><Empty/></div>
    </div>
  </div>
</template>

<script>
import Empty from "../../components/Empty";
export default {
  components: { Empty },


  inject: ["reload"],
  data() {
    return {
      queryModel: {
        isPage: false,
        pageIndex: 1,
        pageSize: 5,
      },
      articlesList: [],

      userId: this.$route.query.uId,
      url: "http://localhost:8510/",
    };
  },
  created() {
    this.getAllByUserId(0);
  },
  computed: {},
  methods: {
    async getAllByUserId(state) {
      const { data: res } = await this.$http.get(
        `News/GetAllByUserId?userId=${this.userId}&&state=${state}`,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取文章列表失败");
      this.articlesList = res.data.data;
      console.log(this.articlesList);
    },

    getImg(url) {
      return this.url + url;
    },
  },
  mounted() {},
};
</script>
<style  scoped>
.cardFoot {
  position: absolute;
  bottom: 0;
  color: #a9a9a9;
}

.cardContent {
  color: #a9a9a9;
  margin-top: 10px;
}
</style>

<template>
  <div>
    <el-main>
      <div style="width:85%;margin: 0 auto;" v-if="newsList.length>0">
        <div
          @click="newsDetails(news.id)"
          class="card"
          v-for="(news,index) in newsList.slice(0, 3)"
          :key="news.id"
        >
          <div class="card-image">
            <el-image :src="getImg(news.imagePath)"></el-image>
          </div>
          <div class="card-body">
            <div class="card-date">
              <el-row>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="作者" placement="top-start">
                      <i class="el-icon-user">
                        ：
                        <span class="fontsize">{{news.user.name}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-tooltip class="item" effect="dark" content="发布时间" placement="top-start">
                      <i class="el-icon-time">
                        ：
                        <span class="fontsize">{{$moment(news.createTime).format("YYYY/MM/DD")}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="浏览量" placement="top-start">
                      <i class="el-icon-view">
                        ：
                        <span class="fontsize">{{news.browseCOunt}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <div class="card-title">
                <h3>
                  <el-tooltip class="item" effect="dark" content="标题" placement="top-start">
                    <i class="el-icon-price-tag">
                      ：
                      <span>
                        <b
                          style="cursor:pointer"
                          @click="newsDetails(news.id)"
                        >{{news.title|strFilter(10)}}</b>
                      </span>
                    </i>
                  </el-tooltip>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div
          @click="newsDetails(news.id)"
          class="card"
          v-for="(news,index) in newsList.slice(3, 6)"
          :key="news.id"
        >
          <div class="card-image">
            <el-image :src="getImg(news.imagePath)"></el-image>
          </div>
          <div class="card-body">
            <div class="card-date">
              <el-row>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="作者" placement="top-start">
                      <i class="el-icon-user">
                        ：
                        <span class="fontsize">{{news.user.name}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-tooltip class="item" effect="dark" content="发布时间" placement="top-start">
                      <i class="el-icon-time">
                        ：
                        <span class="fontsize">{{$moment(news.createTime).format("YYYY-MM-DD")}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="浏览量" placement="top-start">
                      <i class="el-icon-view">
                        ：
                        <span class="fontsize">{{news.browseCOunt}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <div class="card-title">
                <h3>
                  <el-tooltip class="item" effect="dark" content="标题" placement="top-start">
                    <i class="el-icon-price-tag">
                      ：
                      <span>
                        <b
                          style="cursor:pointer"
                          @click="newsDetails(news.id)"
                        >{{news.title|strFilter(10)}}</b>
                      </span>
                    </i>
                  </el-tooltip>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div
          @click="newsDetails(news.id)"
          class="card"
          v-for="(news,index) in newsList.slice(6, 9)"
          :key="news.id"
        >
          <div class="card-image">
            <el-image :src="getImg(news.imagePath)"></el-image>
          </div>
          <div class="card-body">
            <div class="card-date">
              <el-row>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="作者" placement="top-start">
                      <i class="el-icon-user">
                        ：
                        <span class="fontsize">{{news.user.name}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="10">
                  <div class="grid-content bg-purple">
                    <el-tooltip class="item" effect="dark" content="发布时间" placement="top-start">
                      <i class="el-icon-time">
                        ：
                        <span class="fontsize">{{$moment(news.createTime).format("YYYY-MM-DD")}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="grid-content bg-purple-light">
                    <el-tooltip class="item" effect="dark" content="浏览量" placement="top-start">
                      <i class="el-icon-view">
                        ：
                        <span class="fontsize">{{news.browseCOunt}}</span>
                      </i>
                    </el-tooltip>
                  </div>
                </el-col>
              </el-row>
              <div class="card-title">
                <h3>
                  <el-tooltip class="item" effect="dark" content="标题" placement="top-start">
                    <i class="el-icon-price-tag">
                      ：
                      <span>
                        <b
                          style="cursor:pointer"
                          @click="newsDetails(news.id)"
                        >{{news.title|strFilter(10)}}</b>
                      </span>
                    </i>
                  </el-tooltip>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Empty v-else />
    </el-main>
    <div class="fenye">
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryModel.pageIndex"
        :page-sizes="[3,6,9]"
        :page-size="queryModel.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>


<script>
import Bus from "../assets/bus.js";
import Empty from "@/components/Empty.vue";

import { mapState, mapActions } from "vuex";
export default {
  components: { Empty },

  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 9,
      },
      newsList: [],
      total: 0,
      type: false,
      categoryName: "",
      img_urls: require("@/assets//default.jpg"),
      url: "http://localhost:8510/",
    };
  },
  created() {
    this.getData();

    this.getNewsList();
  },
  methods: {
    //初始化数据
    async getNewsList() {
      const { data: res } = await this.$http.get("News/GetAll", {
        params: this.queryModel,
      });
      if (res.code !== 200) return this.$message.error("获取文章列表失败");
      this.newsList = res.data.data;
      this.total = res.data.dataCount;
    },
    //根据分类获取文章
    async getAllByCategory(name) {
      const { data: res } = await this.$http.get(
        "News/GetAllByCategory?categoryName=" + name,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取数据失败");
      this.newsList = res.data.data;
      this.total = res.data.dataCount;
    },

    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;
      if (!this.type) {
        this.getNewsList();
      } else {
        this.getAllByCategory(this.categoryName);
      }
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      if (!this.type) {
        this.getNewsList();
      } else {
        this.getAllByCategory(this.categoryName);
      }
    },
    //查看详情
    newsDetails(newsId) {
      let routeUrl = this.$router.resolve({
        path: "/NewsDetails",
        query: { newsId: newsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    getImg(url) {
      if (url == null) {
        return this.img_urls;
      } else {
        return this.url + url;
      }
    },
    //接收数据
    getData() {
      Bus.$on("newsListByCategoryName", (res) => {
        this.newsList = res.data.data;
        this.total = res.data.dataCount;
      });
      Bus.$on("type", (res) => {
        this.type = res;
      });
      Bus.$on("categoryName", (categoryName) => {
        this.categoryName = categoryName;
      });
    },
  },
};
</script>
<style   scoped>
.box-card {
  width: 100%;
}
.footerCard {
  padding: 0;
  height: auto;
}
.mainCard {
  margin-top: 5px;
}

.fontsize {
  font-size: 10px;
  color: #a3a3a3;
}
.el-image__inner {
  height: 100%;
}
.el-pagination {
  text-align: center;
}
.black {
  min-height: 350px;
}
.fenye {
  background-color: #2e3033;
}
.el-pagination__jump {
  color: #ffffff;
}

.card {
  width: 380px;
  float: left;
  background-color: white;
  box-shadow: 0px 5px 20px #555;

  margin-left: 20px;
  margin-top: 20px;
}
.card a {
  color: #333;
  text-decoration: none;
}
.card:hover .card-image .el-image {
  width: 100%;

  filter: grayscale(0);
}
.card-image {
  height: 250px;
  position: relative;
  overflow: hidden;
}
.card-image .el-image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: grayscale(1);
  transition-property: filter width;
  transition-duration: 0.3s;
}
.card-body {
  text-align: center;
  padding: 15px 20px;
  box-sizing: border-box;
}
.card-date {
  font-family: "Source Sans Pro", sans-serif;
}
.card-title,
.card-exceprt {
  font-family: "Playfair Display", serif;
}
.card-date,
.card-title {
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
}
.card-date,
.card-exceprt,
#case-title {
  color: #777;
}
#case-title {
  position: absolute;
  font: 18px "Microsoft YaHei";
  top: 10px;
  left: 0px;
  right: 0px;
  margin: auto;
  display: block;
  text-align: center;
  text-decoration: none;
}
.small {
  font-size: 10px;
}
</style>

<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main v-bind:style="{ backgroundColor: activeColor }">
      <!-- 回到顶部区域 -->
      <el-backtop :visibility-height="100" :bottom="100">
        <div>
          <i class="layui-icon layui-icon-top" style="font-size:45px"></i>
        </div>
      </el-backtop>
      <!-- 自定义设置 -->
      <div v-if="isSelf" class="setting">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo sssssss"
          @open="handleOpen"
          @close="handleClose"
          :collapse="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
            </template>
            <el-menu-item-group>
              <span slot="title">轮播图管理</span>
              <el-menu-item index="1-0">
                <el-input v-model="this.lunBoLength" :disabled="true" title="设置轮播图长度">
                  <template slot="prepend">
                    <el-button size="mini" @click.stop="compute(`-`)">-</el-button>
                  </template>
                  <template slot="append">
                    <el-button size="mini" @click.stop="compute(`+`)">+</el-button>
                  </template>
                </el-input>
              </el-menu-item>
              <el-menu-item index="1-1" @click="getAllImgsByUserId(1,-1)">我的相册</el-menu-item>
              <el-menu-item index="1-2" @click="getAllImgsByUserId(2,-1)">管理我的相册</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="背景颜色替换">
              <el-menu-item index="1-3">
                默认颜色：
                <colorPicker style="z-index:3" v-model="activeColor" @change="headleChangeColor"></colorPicker>
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="是否开启全屏显示">
              <el-menu-item>
                <el-switch
                  @change="handleChangeSwitch"
                  v-model="isFullscreen"
                  active-color="#ff4949"
                  active-text="NO"
                  inactive-text="YES"
                  inactive-color="#13ce66"
                ></el-switch>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>

      <div class="ss">
        <LunBo ref="lunBoRef" />

        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <MyInfo ref="myInfoRef" />
              <RecentPublish ref="recentPublishRef" class="cardH" />
              <SearchNews ref="searchNewsRef" class="cardH" />
              <MyComments ref="myCommentsRef" class="cardH" />
              <Classification ref="classificationRef" class="cardH" />
              <HotCommentNews ref="hotCommentNewsRef" class="cardH" />
            </div>
          </el-col>
          <el-col :span="18">
            <ArticlesList />
          </el-col>
        </el-row>
      </div>
    </el-main>
    <!-- 我的相册 -->
    <el-dialog title="我的相册" :visible.sync="lunBoDialogVisible">
      <div>
        <div>
          <div class="demo-image__lazy" style="height: 400px;overflow-y: auto;">
            <el-image
              style="display: block;min-height: 200px;"
              v-for="(img,index) in myImgsList.data"
              :key="index"
              :src="getImg(img.url)"
              lazy
              @click="replaceLunBo(img)"
            ></el-image>
          </div>
        </div>
      </div>
      <el-dialog width="12%" title="上传至我的相册" :visible.sync="innerVisible" append-to-body>
        <el-upload
          :action="uploadURL"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture-card"
          :on-exceed="handleExceed"
          :show-file-list="false"
        >
          <el-button
            style="margin:5px 0px 0px 20px "
            type="text"
            @click="headDialogVisible = true"
          >添加图片</el-button>
        </el-upload>
      </el-dialog>
      <span style="font-size:10px">点击图片即可更换轮播图</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lunBoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">上传新的图片</el-button>
      </div>
    </el-dialog>

    <!-- 管理我的相册 -->
    <el-dialog title="管理我的相册" :visible.sync="myImgsDialogisible" width="70%">
      <el-table :data="myImgsList.data">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="url" label="图片" width="200">
          <template slot-scope="props">
            <el-image style="width: 100px; height: 100px" :src="getImg(props.row.url)" fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="日期" width="150"></el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==1" type="success">轮播图片</el-tag>

            <el-tag v-else>图片</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否设置为轮播图" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              :active-value="1"
              :inactive-value="0"
              @change="lunBoStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="180px">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button @click="del(scope.row)" type="danger" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        :page-sizes="[5, 10, 15]"
        :page-size="queryModel.pagesize"
        :current-page="queryModel.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-dialog>
    <el-container>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>
 
<script>
import Top from "@/components/Top.vue";
import Footer from "@/components/Footer.vue";
import LunBo from "@/components/LunBo.vue";
import RecentPublish from "@/components/RecentPublish.vue";
import HotCommentNews from "@/components/HotCommentNews.vue";
import MyInfo from "@/components/MyArticles/MyInfo.vue";
import MyComments from "@/components/MyArticles/MyComments.vue";
import SearchNews from "@/components/SearchNews.vue";
import Classification from "@/components/MyArticles/Classification.vue";
import ArticlesList from "@/components/MyArticles/ArticlesList.vue";
import screenfull from "screenfull";
import Bus from "../assets/bus.js";
export default {
  components: {
    Top,
    Footer,
    LunBo,
    RecentPublish,
    HotCommentNews,
    MyInfo,
    MyComments,
    SearchNews,
    Classification,
    ArticlesList,
  },
  data() {
    return {
      //查询参数
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },
      userId: parseInt(sessionStorage.getItem("userId")),

      isSelf:
        this.$route.query.uId == parseInt(sessionStorage.getItem("userId")),
      activeColor: "#cccccc",
      //轮播图设置
      lunBoDialogVisible: false,
      //管理我的相册
      myImgsDialogisible: false,
      total: 0,
      innerVisible: false,
      //上传图片
      uploadURL: `http://localhost:8510/Imgs/Add?userId=${this.$route.query.uId}`,

      // 请求头,携带token
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片地址
      lunBoLength: 3,
      url: "http://localhost:8510/",
      myImgsList: [],
      //是否开启全屏
      isFullscreen: true,
    };
  },
  created() {
    this.getAllArticlesByUserId();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.destroy();
  },
  methods: {
    //数据初始化
    async getAllArticlesByUserId() {
      const { data: res } = await this.$http.get(
        "News/GetAllByUserId?userId=" + this.userId,
        {
          params: this.queryModel,
        }
      );

      if (res.code !== 200) return this.$message.error("获取文章列表失败");
      this.$refs.lunBoRef.getAllImgsByUserId(this.lunBoLength);
      this.$refs.recentPublishRef.getRecentPublishNewsList(this.userId);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    headleChangeColor(val) {
      this.activeColor = val;
    },
    //轮播图
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 处理移除图片操作
    handleRemove(file) {
      this.$message.success("移除成功");
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      this.getAllImgsByUserId(1, -1);

      this.$message.success("上传成功");
    },
    //超出限制
    handleExceed(files, fileList) {
      this.$message("当前仅支持上传一张照片,请先删除现有图片");
    },
    //替换轮播图
    async replaceLunBo(img) {
      const confirmResult = await this.$confirm(
        "此操作将该图片设置为轮播图片, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消操作");
      if (img.state == 1) {
        return this.$message.info("该图片为轮播图片，请不要重复设置");
      } else {
        img.state = 1;
        this.lunBoStateChange(img);
      }
    },
    //全屏方法
    handleChangeSwitch() {
      if (screenfull.enabled) {
        // 如果不允许进入全屏，发出不允许提示
        this.$message({
          message: "不支持全屏",
          type: "warning",
        });
        return false;
      }
      screenfull.toggle();
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen;
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on("change", this.change);
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off("change", this.change);
      }
    },
    //打开我的相册
    getAllImgsByUserId(type, lunBoListLength) {
      if (type == 1) {
        this.lunBoDialogVisible = true;
      } else {
        this.myImgsDialogisible = true;
      }
      this.getAllImgsByUserIds(lunBoListLength);
    },
    async getAllImgsByUserIds(lunBoListLength) {
      const { data: res } = await this.$http.get(
        `Imgs/GetAllByUserId?userId=${this.userId}&&lunBoListLength=${lunBoListLength}`,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取我的相册失败");

      this.myImgsList = res.data;
      this.total = res.data.dataCount;
      console.log(res.data);
    },
    getImg(url) {
      return this.url + url;
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row.createTime;
      if (date == undefined) {
        return data;
      }
      return this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
    },
    //删除图片
    async del(img) {
      const confirmResult = await this.$confirm(
        "此操作将该图片永久删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm")
        return this.$message.info("已取消该操作");

      const { data: res } = await this.$http.delete("Imgs/Del?id=" + img.id);
      if (res.code !== 200) return this.$message.error(`删除失败`);

      this.getAllImgsByUserId(2, -1);
      this.$message.success("操作成功");
    },
    //更改图片状态
    async lunBoStateChange(imgss) {
      var state = 0;
      if (imgss.state) {
        state = 1;
      }

      const { data: res } = await this.$http.put(
        `Imgs/update?id=${imgss.id}&&state=${state}`
      );
      if (res.code !== 200) {
        return this.$message.error(`设置失败`);
      }
      this.$message.success("更新状态成功");

      this.$refs.lunBoRef.getAllImgsByUserId(5);
    },
    async edit(img) {
      const confirmResult = await this.$confirm(
        "此操作将该图片设置为轮播图片, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm")
        return this.$message.info("已取消该操作");

      const { data: res } = await this.$http.put("Imgs/update?", img);
      if (res.code !== 200) return this.$message.error(`设置失败`);

      this.getAllImgsByUserId(2, -1);
      this.$message.success("操作成功");
    },
    //内层关闭回调
    closeElUpload() {
      this.$refs.lunBoRef.getAllImgsByUserId(5);
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;
      this.getAllImgsByUserId(2, -1);
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getAllImgsByUserId(2, -1);
    },
    compute(type) {
      if (type == "+") {
        this.lunBoLength = this.lunBoLength + 1;
        if (this.lunBoLength > 10) {
          this.lunBoLength = 10;

          return this.$message.error(`长度最长不超过10`);
        }
      } else {
        this.lunBoLength = this.lunBoLength - 1;
        if (this.lunBoLength < 3) {
          this.lunBoLength = 3;
          return this.$message.error("长度最短为3");
        }
      }
      this.$refs.lunBoRef.getAllImgsByUserId(this.lunBoLength);
    },

    //
  },
};
</script>

<style   scoped>
.el-header {
  padding: 0;
  background-color: #2e3033;
}
.el-main {
  min-height: 636px;
  background-color: #cccccc;
}
.ss {
  width: 80%;
  margin: 0 auto;
}

.el-footer {
  background-color: #2e3033;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 10%;
  padding: 0;
}
.cardH {
  margin-top: 10px;
}
.setting {
  float: right;
  margin-right: 30px;
}


.ssss {
  width: 868px;
  height: 448px;
}
</style>
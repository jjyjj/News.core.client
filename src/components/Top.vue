<template>
  <div style="width:100%;margin:0 auto;">
    <el-row>
      <el-col :span="10" :offset="12">
        <div class="grid-content bg-purple-dark">
          <el-menu
            style=" max-width: 800px; float:right"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color=" #2e3033"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="1" @click="goHome()">首页</el-menu-item>
            <el-submenu index="2">
              <template id="cate" slot="title">分类</template>
              <div v-for="categoty in categorysList" :key="categoty.id">
                <el-menu-item
                  @click="getAllByCategory(categoty.name)"
                  :index="`2`+categoty.id"
                >{{categoty.name}}</el-menu-item>
              </div>
            </el-submenu>

            <el-menu-item index="4" @click="goComment()">留言板</el-menu-item>
            <el-menu-item index="5">公告</el-menu-item>
            <el-menu-item index="6" @click="dialogVisible = true">
              <i class="layui-icon layui-icon-search" style="color:#FFFFFF"></i>
            </el-menu-item>
            <el-submenu index="7">
              <template slot="title">
                <span @click="goProfile">{{usersEmail}}</span>
              </template>
              <el-menu-item :disabled="isDisabled" index="7-0" @click="goMyArticles">个人空间</el-menu-item>
              <el-menu-item :disabled="isDisabled" index="7-1" @click="exit">注销</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索区域 -->
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bus from "../assets/bus.js";
import { mapState, mapActions } from "vuex";
export default {
  inject: ["reload"],
  data() {
    return {
      avatar: require("@/assets/jjy1.png"),
      dialogVisible: false,
      usersEmail: sessionStorage.getItem("userEmail")
        ? sessionStorage.getItem("userEmail")
        : "登录注册",
      isDisabled: sessionStorage.getItem("userEmail") ? false : true,
      categotyList: [],
      newsListByCategory: [],
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },
    };
  },
  created() {},
  methods: {
    errorHandler() {
      return true;
    },

    async getAllByCategory(name) {
      this.$router.push("/");
      const { data: res } = await this.$http.get(
        "News/GetAllByCategory?categoryName=" + name,
        this.queryModel
      );
      if (res.code !== 200) return this.$message.error("获取数据失败");
      if (res.data.dataCount == 0) {
        this.$message.error("给类别下没有文章");
      }
      //给news 组件传值
      Bus.$emit("newsListByCategoryName", res);
      Bus.$emit("type", true);
      Bus.$emit("categoryName", name);
      const test = document.querySelector(".content");
      test.scrollIntoView({ behavior: "smooth" });
    },
    exit() {
      window.sessionStorage.clear();
      this.reload();
    },
    goHome() {
      this.$router.push("/");
      this.reload();
    },
    goComment() {
      this.$router.push("/comment");
    },
    goMyArticles() {
    
      let routeUrl = this.$router.resolve({
        path: "/myArticles",
        query: { uId: sessionStorage.getItem("userId") },
      });

      window.open(routeUrl.href);
    },
    goProfile() {
      if (this.usersEmail == "登录注册") {
        this.$router.push("/login");
      } else {
        this.$router.push("/profile");
      }
    },
    handleSelect(key, keyPath) {},
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },

  mounted() {
    this.$store.dispatch("getCategorys");
  },
  computed: {
    ...mapState(["categorysList"]),
  },
};
</script>
<style  scoped>
.el-menu.el-menu--horizontal {
  border-bottom: 0px;
}
</style>

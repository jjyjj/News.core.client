<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <el-card class="box-card" shadow="never">
        <div>
          <el-tabs tab-position="left" @tab-click="handleClick">
            <!-- 个人资料 -->
            <el-tab-pane label="个人资料">
              <PersonalData ref="personalData" />
            </el-tab-pane>
            <!-- 我的粉丝 -->
            <el-tab-pane label="我的粉丝">
              <MyFans ref="myFans" />
            </el-tab-pane>
            <!-- 我关注的人 -->
            <el-tab-pane label="我关注的人">
              <MyFocus ref="myFocus" />
            </el-tab-pane>

            <el-tab-pane label="账户设置">
              <el-card class="box-card">
                <div>
                  <AccountSetting />
                </div>
              </el-card>
            </el-tab-pane>

            <!-- 我的博客 -->
            <el-tab-pane label="文章管理">
              <div>
                <ArticleManager ref="myArticle" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="评论管理">
              <div>
                <CommentManager ref="commentManager" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </el-main>
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
import AccountSetting from "@/components/profile/AccountSetting.vue";
import PersonalData from "@/components/profile/PersonalData.vue";
import MyFans from "@/components/profile/MyFans.vue";
import MyFocus from "@/components/profile/MyFocus.vue";
import ArticleManager from "@/components/profile/ArticleManager.vue";
import CommentManager from "@/components/CommentManager.vue";
import { emailValid, mobileValid } from "../comment.js";
export default {
  components: {
    Top,
    Footer,
    AccountSetting,
    PersonalData,
    MyFans,
    MyFocus,
    ArticleManager,
    CommentManager,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      var name = tab.label;
      if (name == "我的粉丝") {
        this.$refs.myFans.getFocusList();
      }
      if (name == "我关注的人") {
        this.$refs.myFocus.getFocusList();
      }

      if (name == "文章管理") {
        this.$refs.myArticle.myArticleCategoty();
      }
      if (name == "评论管理") {
        this.$refs.commentManager.getAllByUserId();
      }
    },
  },
};
</script>

<style   scoped>
.el-header {
  padding: 0;
  background-color: #2e3033;
}
.el-main {
  width: 72%;
  margin: 0 auto;

  min-height: 636px;
}
.el-footer {
  background-color: #2e3033;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 10%;
}
</style>
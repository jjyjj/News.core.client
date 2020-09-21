<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <el-card class="box-card" shadow="never">
        <el-page-header @back="goBack"></el-page-header>
        <el-alert
          title="请按以下步骤进行文章发布"
          show-icon
          center
          type="info"
          style="margin: 20px 0 0 0"
          :closable="false"
        ></el-alert>
        <el-steps
          align-center
          :active="activeName-1"
          finish-status="success"
          style="margin: 20px 0 20px 0"
        >
          <el-step title="基本信息"></el-step>
          <el-step title="文章内容"></el-step>
          <el-step title="内容预览"></el-step>
        </el-steps>
        <el-form
          ref="addArticleRef"
          :rules="addArticleRules"
          :model="addArticleForm"
          label-width="120px"
          label-position="top"
        >
          <el-tabs
            :before-leave="beforeTableLeave"
            tab-position="left"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane label="基本信息" name="1">
              <el-form-item prop="Title" label="填写文章标题">
                <el-input
                  v-model="addArticleForm.Title"
                  placeholder="请填写文章标题"
                  maxlength="15"
                  show-word-limit
                  clearable
                ></el-input>
              </el-form-item>

              <el-form-item prop="categories" label="选择文章类别">
                <el-checkbox-group
                  :max="3"
                  :min="1"
                  v-model="addArticleForm.categories"
                  @change="handleCheckedCitiesChange"
                >
                  <el-checkbox
                    v-for="item in categorysList"
                    :label="item.id"
                    :key="item.id"
                  >{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item prop label="选择文章封面">
                <el-upload
                  :action="uploadURL"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  list-type="picture-card"
                  :limit="1"
                  :on-exceed="handleExceed"
                >
                  <el-button
                    style="margin:5px 0px 0px 20px "
                    type="text"
                    @click="headDialogVisible = true"
                  >添加封面</el-button>
                </el-upload>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="文章内容" name="2">
              <el-form-item prop="Content" label="填写文章内容">
                <el-tabs v-model="type" type="card" @tab-click="editorHandleClick">
                  <el-tab-pane label="富文本编辑器" name="4.1">
                    <editor @sendmsg="getContent"></editor>
                  </el-tab-pane>
                  <el-tab-pane label="Markdown" name="4.2">
                    <div class="markdown">
                      <div class="container">
                        <mavon-editor
                          v-model="mavoneditorContent"
                          ref="md"
                          @imgAdd="$imgAdd"
                          @change="change"
                          style="min-height: 600px"
                        />
                      </div>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
              <el-button type="primary" plain @click="see">内容预览</el-button>
              <el-button type="primary" plain @click="submit(1)">保存至草稿箱</el-button>
              <el-button type="primary" plain @click="submit(0)">直接发布</el-button>
            </el-tab-pane>
            <el-tab-pane label="内容预览" name="3" disabled>
              <div class>
                <yulan :content="content" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
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
import Bus from "../assets/bus.js";
import Top from "@/components/Top.vue";
import Footer from "@/components/Footer.vue";
import editor from "@/components/Wangeditor.vue";
import yulan from "@/components/yulan.vue";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { titleValid, categorysValid } from "../comment.js";
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "",
  props: [],
  components: {
    Top,
    Footer,
    editor,
    mavonEditor,
    yulan,
  },
  data() {
    return {
      content: "base on wangeditor",
      addArticleForm: {
        UserId: parseInt(sessionStorage.getItem("userId")),
        Title: "",
        categories: [],
        ImagePath: "",
        Content: "",
      },
      type: "4.1",
      addArticleRules: {
        Title: titleValid,
        categories: categorysValid,
        Content: { required: true, message: "内容不可为空", trigger: "blur" },
      },
      activeName: "1",

      //类别
      categorysList: [],

      //选择封面

      disabled: false,
      //markdown
      html: "",
      WangeditorContent: "",
      mavoneditorContent: "",
      configs: {},

      //上传图片
      uploadURL: "http://localhost:8510/CommonMethods/Post?types=2",

      // 请求头,携带token
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片地址
      previewPath: "",
      previewVisible: false,
      url: "http://localhost:8510/",
    };
  },
  created() {
    this.getAllCategorys();
  },
  methods: {
    //初始化数据
    async getAllCategorys() {
    
      const { data: ress } = await this.$http.get("Category/getAll");
      if (ress.code !== 200) return this.$message.error("移除失败");
      this.categorysList = ress.data;
    },

    addArticle() {},
    handleClick(tab, event) {},
    beforeTableLeave(activeName, oldActiveName) {
      if (
        this.addArticleForm.categories.length == 0 ||
        this.addArticleForm.Title == ""
      ) {
        this.$message.error("请填写 * 标记的内容");
        return false;
      }
    },
    editorHandleClick(tab, event) {
      console.log(tab.name);
      if (tab.name == "4.1") {
        this.type = "4.1";
        this.html = "";
      } else {
        this.type = "4.2";
        this.WangeditorContent = "";
      }
    },
    //返回
    goBack() {
      window.history.go(-1);
    },
    // 处理移除图片操作
    async handleRemove(file) {
      const { data: ress } = await this.$http.delete(
        "CommonMethods/Delete?filePath=" + this.addArticleForm.ImagePath
      );
      if (ress.code !== 200) return this.$message.error("移除失败");
      this.$message.success("移除成功");
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      this.addArticleForm.ImagePath = response.data[0];

      this.$message.success("上传成功");
    },
    //超出限制
    handleExceed(files, fileList) {
      this.$message("当前仅支持上传一张照片,请先删除现有图片");
    },
    handleCheckedCitiesChange(value) {},

    //markdown
    // 将图片上传到服务器，返回地址替换到md中
    $imgAdd(pos, $file) {
      let formdata = new FormData();

      this.$upload
        .post("/上传接口地址", formdata)
        .then((res) => {
          // console.log(res.data);
          this.$refs.md.$img2Url(pos, res.data);
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    // 所有操作都会被解析重新渲染
    change(value, render) {
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },
    //获取颇富文本编辑器传过来的内容
    getContent(data) {
      this.WangeditorContent = data;
    },
    // 提交
    async submit(state) {
      if (this.type == "4.1") {
        this.addArticleForm.Content = this.WangeditorContent;
      } else {
        this.addArticleForm.Content = this.html;
      }

      this.$refs.addArticleRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "news/Add?state=" + state,
          this.addArticleForm
        );
        if (res.code !== 200) return this.$message.error(res.msg);
        else {
          this.$message.success("发布成功,3s跳转至详情页面");
          setTimeout(() => {
            this.$router.push("NewsDetails?newsId=" + res.data);
          }, 3000);
        }
      });
      console.log(this.type);
      console.log(this.addArticleForm);
    },
    see() {
      this.activeName = "3";
      if (this.type == "4.1") {
        this.content = this.WangeditorContent;
      } else {
        this.content = this.html;
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
  width: 65%;
  margin: 0 auto;

  min-height: 636px;
}
.el-footer {
  background-color: #2e3033;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
  height: 10%;
}
.fontsize {
  font-size: 15px;
  color: #a3a3a3;
}
</style>
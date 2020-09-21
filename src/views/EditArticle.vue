<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <el-card class="box-card" shadow="never">
        <el-page-header @back="goBack"></el-page-header>
        <el-alert
          title="请按以下步骤进行文章修改"
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
          ref="editArticlRef"
          :rules="editArticlRules"
          :model="editArticlForm.news"
          label-width="120px"
          label-position="top"
        >
          <el-tabs tab-position="left" v-model="activeName">
            <el-tab-pane label="基本信息" name="1">
              <el-form-item label="填写文章标题">
                <el-input
                  v-model="editArticlForm.news.title"
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
                  v-model="checkedCities"
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
                  :file-list="fileList"
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
                <el-tabs v-model="type" type="card">
                  <el-tab-pane label="富文本编辑器" name="4.1">
                    <sss @sendmsg="getContent" :content="content" />
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
import sss from "@/components/sss.vue";
import yulan from "@/components/yulan.vue";
import { mavonEditor } from "mavon-editor";
import E from "wangeditor";
import "mavon-editor/dist/css/index.css";
import { titleValid, categorysValid } from "../comment.js";

export default {
  components: {
    Top,
    Footer,
    sss,
    yulan,
  },

  data() {
    return {
      content: "base on wangeditor",

      editArticlForm: {
        categories: [],
      },
      checkedCities: [],
      type: "4.1",
      editArticlRules: {
        categories: {
          required: true,
          message: "",
          trigger: "blur",
        },
        Content: { required: true, message: "内容不可为空", trigger: "blur" },
      },
      activeName: "1",

      //类别
      categorysList: [],

      //选择封面

      disabled: false,

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
      fileList: [],
      fileList: [
        {
          name: "",
          url: "",
        },
      ],
    };
  },
  created() {
    this.getOneNewsById();
    this.getAllCategorys();
  },
  methods: {
    //初始化类别列表数据
   async getAllCategorys() {
    
      const { data: ress } = await this.$http.get("Category/getAll");
      if (ress.code !== 200) return this.$message.error("移除失败");
      this.categorysList = ress.data;
    },

    //获取文章信息
    async getOneNewsById() {
      const { data: res } = await this.$http.get(
        "News/GetDetailsById?newsId=" + this.$route.query.newsId
      );
      if (res.code !== 200) return this.$message.error("获取文章数据失败");

      this.editArticlForm = res.data;
      var cates = res.data.categories;
      this.fileList[0].name = this.editArticlForm.news.imagePath;
      this.fileList[0].url = this.url + this.editArticlForm.news.imagePath;
      console.log(this.fileList);

      for (let index = 0; index < cates.length; index++) {
        this.checkedCities.push(cates[index].id);
      }
      this.content = this.editArticlForm.news.content;
    },
    //返回
    goBack() {
      window.history.go(-1);
    },
    //选择类别
    handleCheckedCitiesChange(value) {},
    //选择封面
    // 处理移除图片操作
    async handleRemove(file) {
      const { data: ress } = await this.$http.delete(
        "CommonMethods/Delete?filePath=" + this.editArticlForm.news.ImagePath
      );
      if (ress.code !== 200) return this.$message.error("移除失败");
      this.$message.success("移除成功");
    },
    // 监听图片上传成功的事件
    handleSuccess(response) {
      this.editArticlForm.news.ImagePath = response.data[0];
      this.$message.success("上传成功");
    },
    //超出限制
    handleExceed(files, fileList) {
      this.$message("当前仅支持上传一张照片,请先删除现有图片");
    },

    //获取颇富文本编辑器传过来的内容
    getContent(data) {
      this.editArticlForm.news.content = data;
    },
    // 提交修改
    async submit(state) {
      var news = this.editArticlForm.news;
      var cateId = this.checkedCities;
      news.state = state;
      const { data: res } = await this.$http.put(`news/update`, {
        news,
        cateId,
      });
      if (res.code !== 200) return this.$message.error(res.msg);
      else {
        this.$message.success("发布成功,3s跳转至详情页面");
        setTimeout(() => {
          this.$router.push(
            "NewsDetails?newsId=" + this.editArticlForm.news.id
          );
        }, 3000);
      }
    },
    //内容预览
    see() {
      this.activeName = "3";
      this.content = this.editArticlForm.news.content;
    },
  },
  mounted() {},
  watch: {},
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
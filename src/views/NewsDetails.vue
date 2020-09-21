
<template>
  <div>
    <el-container>
      <!-- 回到顶部区域 -->
      <el-backtop :bottom="100">
        <div>
          <i class="layui-icon layui-icon-top" style="font-size:45px"></i>
        </div>
      </el-backtop>

      <el-header style="padding:0; background-color: #2e3033;">
        <Top />
      </el-header>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="grid-content bg-purple">
              <!-- 详情区域 -->

              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <!-- 标题区域 -->
                  <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>

                    <el-breadcrumb-item v-if="newsCategoryList">
                      <span>{{newsCategoryList[0].name}}</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>详情</el-breadcrumb-item>
                  </el-breadcrumb>
                  <div class="title">
                    <span>
                      <b>{{newsDetails.title}}</b>
                    </span>
                  </div>
                  <div>
                    <el-row :gutter="20">
                      <el-col class :span="23">
                        <div style="margin-top:20px" class="grid-content bg-purple">
                          <el-row>
                            <el-col :span="4" :offset="8">
                              <div class="grid-content bg-purple">
                                <span
                                  class="el-icon-user"
                                  v-if="newsDetails.user"
                                >{{newsDetails.user.name}}</span>
                              </div>
                            </el-col>
                            <el-col :span="4">
                              <div class="grid-content bg-purple-light">
                                <span
                                  class="el-icon-time"
                                >: {{newsDetails.createTime|dateFilter('L')}}</span>
                              </div>
                            </el-col>
                            <el-col :span="4">
                              <div class="grid-content bg-purple">
                                <span class="el-icon-view">: {{newsDetails.browseCOunt}}</span>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-collapse v-model="activeNames">
                        <el-collapse-item name="1">
                          <el-alert title type="info" :closable="false">
                            版权声明：本文为作者原创文章，遵循 CC 4.0 BY-SA 版权协议，转载请附上原文出处链接和本声明。
                            <br />本文链接：
                            <span>{{this.adressUrl}}</span>
                          </el-alert>
                        </el-collapse-item>
                      </el-collapse>
                    </el-row>
                  </div>
                </div>
                <!-- 新闻详情区域 -->
                <div style="height:500px" v-html="newsDetails.content"></div>

                <div v-if="newsCategoryList">
                  类别：
                  <el-tag
                    style="margin-left:10px"
                    type="success"
                    v-for="(item,index) in newsCategoryList"
                    :key="index"
                  >{{item.name}}</el-tag>
                </div>
                <!-- 上下一篇区域 -->
                <div>
                  <el-tag effect="plain" v-if="nextNewsId!=0" style="float:left;cursor:pointer">
                    <i class="el-icon-caret-left"></i>
                    <span @click="preAndNext(nextNewsId)">{{nextNewsTitle|strFilter(20)}}</span>
                  </el-tag>

                  <el-tag
                    effect="plain"
                    v-if="previousNewsId!=0"
                    style="float:right;cursor:pointer"
                  >
                    <span @click="preAndNext(previousNewsId)">{{previousNewsTitle|strFilter(20)}}</span>
                    <i class="el-icon-caret-right"></i>
                  </el-tag>
                </div>
              </el-card>
              <div>
                <el-card class="box-card" style="margin:15px 0" shadow="never">
                  <div>
                    <el-row :gutter="20">
                      <el-col :span="2">
                        <div class="grid-content bg-purple">
                          <div class="demo-type">
                            <div v-if="newsDetails.user" @click="goMyArticle(newsDetails.userId)">
                              <el-image
                                class="avatar"
                                style=" cursor: pointer"
                                :src="getImg(newsDetails.user.imgUrl)"
                                fit="fit"
                              ></el-image>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="22">
                        <div class="grid-content bg-purple">
                          <div>
                            <b v-if="newsDetails.user">{{newsDetails.user.name}}</b>
                            <el-tooltip class="item" effect="dark" content="发送邮件" placement="top">
                              <el-button
                                @click="openEmail"
                                icon="el-icon-message"
                                circle
                                style="float:right"
                              ></el-button>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" content="关注他" placement="top">
                              <el-button
                                :disabled="isSelf( userId,newsDetails.userId)"
                                @click="addFans(newsDetails.userId)"
                                icon="el-icon-thumb"
                                circle
                                style="float:right;margin-right:20px"
                              ></el-button>
                            </el-tooltip>
                          </div>
                          <div style="margin-top:20px;font-size:15px;color:#8c8c8c">
                            共发布了
                            <b>{{this.usersNews.dataCount}}&nbsp;</b>篇文章
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>

                <!-- 发送邮件面板 -->
                <el-dialog title="发送邮件" :visible.sync="sendEmailDialogVisible" width="60%">
                  <el-form ref="sendEmailRef" :model="sendEmailForm" label-width="100px">
                    <el-form-item label="收件人:">
                      <span>{{sendEmailForm.receiverName}}</span>
                      <span style="margin-left:10px">{{ '<'+sendEmailForm.receiverEmail+'>'}}</span>
                    </el-form-item>
                    <el-form-item label="发送人:">
                      <el-input
                        placeholder="请输入您的邮箱"
                        v-model="sendEmailForm.senderEmail"
                        class="input-with-select"
                        style="width:45%"
                      >
                        <el-select
                          v-model="sendEmailForm.emailType"
                          slot="append"
                          placeholder="请选择"
                          style="width:120px"
                        >
                          <el-option
                            v-for="item in areas"
                            :key="item.value"
                            :label="item.number"
                            :value="item.value"
                            :disabled="item.disabled"
                          ></el-option>
                        </el-select>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="主题:">
                      <el-input
                        placeholder="请输入主题"
                        clearable
                        maxlength="30"
                        show-word-limit
                        v-model="sendEmailForm.title"
                      ></el-input>
                    </el-form-item>

                    <el-form-item label="正文:">
                      <Editor />
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="sendEmailDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="sendEmailDialogVisible = false">确 定</el-button>
                  </span>
                </el-dialog>
              </div>

              <!-- 评论区域 -->
              <el-card class="box-card" shadow="never">
                <div>
                  <span>
                    <i class="el-icon-comment"></i>
                    <b>评论列表</b>
                  </span>
                  <el-button @click="openAddComment(1)" round style="float: right;  ">发表评论</el-button>

                  <el-divider>
                    <span>
                      共
                      <span style="padding:10px">
                        <b>{{this.total}}</b>
                      </span>条评论
                    </span>
                  </el-divider>
                </div>
                <div v-if="this.commentsList.length>0" class="commentDiv">
                  <!-- 评论列表区域 -->
                  <el-card
                    class="box-card"
                    shadow="never"
                    v-for="item in this.commentsList"
                    :key="item.id"
                  >
                    <div>
                      <div id="comments">
                        <ol class="comments-list">
                          <li class="comment">
                            <div>
                              <img
                                :src="getImg(item.comments[0].user.imgUrl)"
                                alt="Avatar"
                                class="avatar"
                              />

                              <div class="comment-meta">
                                <span class="author">
                                  <span>{{item.comments[0].userName}}</span>
                                </span>
                                <span class="date">
                                  <span>{{$moment(item.comments[0].createTime).format("LLL")}}</span>
                                </span>
                                <span class="reply">
                                  <span
                                    @click="openAddComment(2,item.comments[0].userName,item.comments[0].id) ,ss(item.comments[0].id)"
                                  >
                                    <el-tooltip
                                      v-if="item.comments[0].userName!=sssss"
                                      class="item"
                                      effect="dark"
                                      content="回复"
                                      placement="top"
                                    >
                                      <el-button
                                        type="primary"
                                        icon="el-icon-chat-dot-round"
                                        circle
                                      ></el-button>
                                    </el-tooltip>

                                    <el-tooltip
                                      v-else
                                      class="item"
                                      effect="dark"
                                      content="删除"
                                      placement="top"
                                    >
                                      <el-button type="danger" icon="el-icon-delete" circle></el-button>
                                    </el-tooltip>
                                  </span>
                                </span>
                              </div>
                              <div class="comment-body">
                                <div v-html="item.comments[0].content">{{}}</div>
                              </div>
                            </div>

                            <ul class="children">
                              <li
                                class="comment"
                                v-for="items in item.commentsChildren"
                                :key="items.id"
                              >
                                <div>
                                  <img :src="getImg(items.user.imgUrl)" alt="Avatar" class="avatar" />
                                  <div class="comment-meta">
                                    <span class="author">
                                      <span>{{items.user.name}} @ {{items.userName}}</span>
                                    </span>
                                    <span class="date">
                                      <span>{{$moment(items.createTime).format("LLL")}}</span>
                                    </span>
                                    <span class="reply">
                                      <span
                                        @click="openAddComment(2,items.user.name,item.comments[0].id,items.id)"
                                      >
                                        <el-tooltip
                                          v-if="items.user.name!=sssss"
                                          class="item"
                                          effect="dark"
                                          content="回复"
                                          placement="top"
                                        >
                                          <el-button
                                            type="primary"
                                            icon="el-icon-chat-dot-round"
                                            circle
                                          ></el-button>
                                        </el-tooltip>

                                        <el-tooltip
                                          v-else
                                          class="item"
                                          effect="dark"
                                          content="删除"
                                          placement="top"
                                        >
                                          <el-button type="danger" icon="el-icon-delete" circle></el-button>
                                        </el-tooltip>
                                      </span>
                                    </span>
                                  </div>
                                  <!-- .comment-meta -->

                                  <div class="comment-body" v-html="items.content"></div>

                                  <!-- .comment-body -->
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </el-card>
                </div>
                <Empty v-else />
                <!-- 分页区域 -->
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="queryModel.pageIndex"
                  :page-sizes="[1, 2, 4]"
                  :page-size="queryModel.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </el-card>
            </div>
          </el-col>
          <!-- 右侧边栏区域 -->
          <el-col :span="6" style="float:right">
            <div class="grid-content bg-purple-light">
              <div class="rightCard">
                <!-- 作者近期发布 -->
                <RecentPublish ref="recentPublish" />
                <br />
                <!-- 广告区域 -->
                <Advertisement />
                <br />
                <!-- 社区区域 -->
                <Community />
                <br />

                <!-- 友情连接区域 -->
                <Links />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <!-- 发表评论对话框 -->
      <el-dialog
        title="发表评论"
        :visible.sync="addCommentDialogVisible"
        width="70%"
        @close="closeAddComment"
      >
        <el-form
          ref="addCommentFormRef"
          :model="addCommentForm"
          :rules="addCommentFormRules"
          label-width="80px"
        >
          <el-form-item label="评论人">
            <b>{{this.addCommentForm.userName}}</b>
          </el-form-item>
          <el-form-item label="评论内容" prop="content">
            <editor @sendmsg="getContent"></editor>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCommentDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addComment">发表评论</el-button>
        </span>
      </el-dialog>

      <el-dialog
        :title="'对'+this.addCommentChildForm.userName+`的评论进行评论`"
        :visible.sync="addCommentChildDialogVisible"
        width="70%"
        @close="closeAddComment"
      >
        <el-form
          ref="addCommentChildFormRef"
          :model="addCommentChildForm"
          :rules="addCommentChildFormRules"
          label-width="80px"
        >
          <el-form-item label="评论人">
            <b>{{this.addCommentChildForm.name}}</b>
          </el-form-item>
          <el-form-item label="评论内容" prop="content">
            <editor @sendmsg="getContent"></editor>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCommentChildDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCommentChild">发表评论</el-button>
        </span>
      </el-dialog>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import Footer from "@/components/Footer.vue";
import Editor from "@/components/Wangeditor.vue";
import HotNews from "@/components/HotCommentNews.vue";
import Advertisement from "@/components/Advertisement.vue";
import Community from "@/components/Community.vue";
import Links from "@/components/Links.vue";
import RecentPublish from "@/components/RecentPublish.vue";

import Empty from "@/components/Empty.vue";
import { isRequire } from "../comment.js";
export default {
  inject: ["reload"],

  components: {
    Top,
    Footer,
    Editor,
    HotNews,
    Advertisement,
    Community,
    Links,
    RecentPublish,
    Empty,
  },

  data() {
    return {
      //标题折叠区域
      adressUrl: window.location.href,
      activeNames: ["1"],
      //查询参数
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 2,
      },
      total: 0,

      //文章详情
      newsDetails: [],
      //文章的分类
      newsCategoryList: [],
      //
      usersNews: [],
      //上下一篇的信息参数
      nextNewsTitle: "",
      nextNewsId: "",
      nextNewsTitle: "",
      previousNewsId: "",
      previousNewsTitle: "",
      //评论列表
      commentsList: [],
      //评论表单
      addCommentForm: {
        newsId: Number,
        userId: Number,
        userName: "",
        content: "",
      },
      addCommentFormRules: {
        content: isRequire,
      },
      addCommentDialogVisible: false,
      //子评论表单
      addCommentChildFormRules: {},
      addCommentChildDialogVisible: false,
      addCommentChildForm: {
        newsId: Number,
        userId: Number,
        commentsId: Number,
        userName: "",
        content: "",
        name: sessionStorage.getItem("userName"),
      },
      userId: parseInt(sessionStorage.getItem("userId")),
      sssss: sessionStorage.getItem("userName"),
      //发送邮件
      sendEmailDialogVisible: false,
      sendEmailForm: {
        receiverEmail: "",
        receiverName: "",
        senderEmail: "",
        sendContent: "",
        emailType: "",
        title: "",
      },
      areas: [
        {
          value: "0",
          number: "@qq.com",
          label: "QQ",
        },
        {
          value: "1",
          number: "@163.com",
          label: "网易",
        },
      ],
      url: "http://localhost:8510/",
    };
  },

  created() {
    this.getNewsDetails(this.$route.query.newsId);
    this.getCommentsList();
  },

  computed: {},
  methods: {
    //初始化数据
    async getNewsDetails(newsId) {
      const { data: res } = await this.$http.get(
        "News/GetDetailsById?newsId=" + newsId
      );
      if (res.code !== 200) return this.$message.error("获取文章详情失败");

      this.newsDetails = res.data.news;
      this.newsCategoryList = res.data.categories;
      this.nextNewsTitle = res.data.next;
      this.nextNewsId = res.data.nextId;
      this.previousNewsId = res.data.previousId;
      this.previousNewsTitle = res.data.previous;
      this.getOneNewByUserId(this.newsDetails.user.id);

      console.log(this.newsDetails.user.id);
    },
    //上下一篇
    preAndNext(newsId) {
      this.$router.push("NewsDetails?newsId=" + newsId);
      this.reload();
    },
    //获取发表人的博客
    async getOneNewByUserId(userId) {
      const { data: res } = await this.$http.get(
        "News/GetAllByUserId?userId=" + userId
      );
      if (res.code !== 200) return this.$message.error("获取文章详情失败");
      this.usersNews = res.data;

      this.$refs.recentPublish.getRecentPublishNewsList(userId);
    },
    //打开评论窗口sss
    openAddComment(type, userName, commentsId, commentsChildrenId) {
      var userId = parseInt(sessionStorage.getItem("userId"));
      var newsId = parseInt(this.$route.query.newsId);
      if (type == 1) {
        var userNames = sessionStorage.getItem("userName");
        if (userId != null && userId > 0) {
          this.addCommentForm.userId = userId;
          this.addCommentForm.userName = userNames;
          this.addCommentForm.newsId = newsId;
          this.addCommentDialogVisible = true;
        } else {
          return this.$message.error("对不起，您未登录,无法进行评论");
        }
      } else {
        if (userId != null && userId > 0) {
          this.addCommentChildForm.userName = userName;
          this.addCommentChildForm.userId = userId;
          this.addCommentChildForm.newsId = newsId;
          this.addCommentChildForm.commentsId = commentsId;
          if (
            this.addCommentChildForm.userName ==
            sessionStorage.getItem("userName")
          ) {
            if (commentsChildrenId == null) {
              this.deleteComment(commentsId);
            } else {
              this.deleteCommentChild(commentsChildrenId);
            }
          } else {
            this.addCommentChildDialogVisible = true;
          }
        } else {
          return this.$message.error("对不起，您未登录,无法进行评论");
        }
      }
    },
    //获取颇富文本编辑器传过来的内容
    getContent(data) {
      this.addCommentForm.content = data;
      this.addCommentChildForm.content = data;
    },
    //发表一级评论
    addComment() {
      this.$refs.addCommentFormRef.validate(async (validate) => {
        if (!validate) return;
        else {
          if (this.addCommentForm.content == "<p><br></p>")
            return this.$message.error("内容不可为空");
          else {
            const { data: res } = await this.$http.post(
              "comment/Add",
              this.addCommentForm
            );
            if (res.code !== 200) return this.$message.error("添加评论失败");
            else {
              this.$message.success("添加成功");
              this.getCommentsList();
            }

            this.addCommentDialogVisible = false;
            this.$refs.addCommentFormRef.resetFields();
          }
        }
      });
    },

    //获取评论列表
    async getCommentsList() {
      const { data: res } = await this.$http.get(
        "Comment/GetAll?newsId=" + this.$route.query.newsId,
        { params: this.queryModel }
      );

      if (res.code !== 200) return this.$message.error("获取评论失败");
      this.commentsList = res.data.data;
      this.total = res.data.dataCount;
      console.log(this.commentsList);
    },
    closeAddComment() {
      this.addCommentForm.content = null;
    },
    //发表二级评论
    addCommentChild() {
      this.$refs.addCommentChildFormRef.validate(async (validate) => {
        if (!validate) return;
        else {
          if (this.addCommentChildForm.content == "<p><br></p>")
            return this.$message.error("内容不可为空");
          else {
            const { data: res } = await this.$http.post(
              "CommentChild/add",
              this.addCommentChildForm
            );
            if (res.code !== 200) return this.$message.error("添加评论失败");
            else {
              this.$message.success("添加成功");
              this.addCommentChildDialogVisible = false;
              this.getCommentsList();
            }
          }
        }
      });
    },

    getImg(imgUrl) {
      return this.url + imgUrl;
    },
    //评论分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;

      this.getCommentsList();
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getCommentsList();
    },
    //删除所有评论
    async deleteComment(commentId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该评论及以下所有子评论, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        `comment/del?commentId=` + commentId
      );
      if (res.code !== 200) return this.$message.error("删除评论失败");
      this.$message.success("删除评论成功");
      this.getCommentsList();
    },
    //删除子评论
    async deleteCommentChild(commentChildId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该评论, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        `CommentChild/del?commentChildId=` + commentChildId
      );
      if (res.code !== 200) return this.$message.error("删除评论失败");
      this.$message.success("删除评论成功");
      this.getCommentsList();
    },
    //发送邮件
    openEmail() {
      this.sendEmailForm.receiverName = this.newsDetails.user.name;
      this.sendEmailForm.receiverEmail = this.newsDetails.user.email;
      this.sendEmailDialogVisible = true;
    },
    //添加关注
    async addFans(fansId) {
      var userId = parseInt(sessionStorage.getItem("userId"));
      if (userId != null && userId > 0 && userId != fansId) {
        const { data: res } = await this.$http.post(
          `Focus/add?userId=` + userId + `&focusId=` + fansId + ``
        );
        if (res.code !== 200) return this.$message.error(res.msg);
        else this.$message.success(res.msg);
      } else {
        return this.$message.error("对不起，关注失败，请检查是否登录");
      }
    },
    goMyArticle(uId) {
      let routeUrl = this.$router.resolve({
        path: "/myArticles",
        query: { uId: uId },
      });

      window.open(routeUrl.href, "_blank");
    },
    isSelf(userId, fansId) {
      if (userId == fansId || userId == null) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style   scoped>
.el-main {
  width: 75%;
  margin: 0 auto;
}
.el-footer {
  background-color: #2e3033;
  color: #ffffff;
  text-align: center;
  line-height: 60px;
}
.fontsize {
  font-size: 15px;
  color: #a3a3a3;
}

.title {
  text-align: center;
  margin: 10px 0;
}
.i-user-time {
  margin: 15px 15px 0;
}

.commentDiv > .el-card {
  margin-top: 10px;
}
.el-pagination {
  text-align: center;
  margin: 10px 0;
}
.returnUp {
  height: 100%;
  width: 100%;
  background-color: #f2f5f6;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
  text-align: center;
  line-height: 40px;
  color: #4a14c9;
}
.el-backtop {
  width: auto;
  height: auto;
}

/* 评论区域 */

#comments {
  font-size: 13px;
  font-size: 0.8125rem;
}
#comments .comments-title {
  margin: 0 0 5px 0;
}
#comments .leave-comment {
  display: block;
  margin: 0 0 40px 0;
}
#comments ul,
#comments ol {
  margin: 0;
  padding: 0;
}
#comments .comment {
  margin: 0;
  padding: 0;
  list-style: none;
  clear: both;
}
#comments .comments-title {
  text-shadow: none;
  margin-bottom: 0;
}
.avatar {
  float: left;
  width: 65px;
  height: 70px;

  -webkit-border-radius: 50%;
  -webkit-background-clip: padding-box;
  -moz-border-radius: 50%;
  -moz-background-clip: padding;
  border-radius: 50%;
  background-clip: padding-box;
}
#comments .children {
  margin: 0 0 0 90px;
}
#comments .comment-meta {
  margin: 0 0 0 90px;
}
#comments .comment-meta a {
  color: #333333;
}
#comments .comment-meta a:hover {
  color: #bd1550;
}
#comments .comment-meta .author {
  margin: 0 20px 0 0;
  font-weight: bold;
}
#comments .comment-meta .date {
  margin: 0 20px 0 0;
  color: #b3b3b3;
}
#comments .comment-meta .date a {
  color: #666666;
}
#comments .comment-meta .reply {
  float: right;
}
#comments .comment-body {
  margin: 10px 0 35px 90px;
}
.comment-navigation {
  width: 100%;
  border-top: 1px solid #ccc;
  padding: 2px 0 0 0;
}
.comment-navigation .nav-content {
  border-top: 1px solid #ccc;
  width: 100%;
  padding: 10px 0 0 0;
}
.comment-navigation .nav-previous {
  float: left;
  width: 50%;
}
.comment-navigation .nav-next {
  float: right;
  width: 50%;
  text-align: right;
}
#respond {
  margin: 55px 0 0 0;
}
.el-tag {
  margin: 15px 0;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
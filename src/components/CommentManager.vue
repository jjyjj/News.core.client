<template>
  <div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>我的评论</span>
        </div>
        <!-- 搜索区域 -->
        <el-row :gutter="20">
          <el-col :span="10">
            <el-date-picker
              v-model="value2"
              :unlink-panels="true"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectEndMonth"
              :clearable="false"
            >></el-date-picker>
          </el-col>
          <el-col :span="4" :offset="10"></el-col>
        </el-row>
        <el-table
          :data="commentsList.filter(data => !search || data.comments[0].content.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%"
          @select-all="toggleSelection"
          @selection-change="selectItem"
          @row-click="onSelectOp"
          stripe
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column type="expand">
            <template slot-scope="scope">
              <div v-if="scope.row.commentsChildren.length>0">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label>
                    <div class="block">
                      <el-timeline reverse="false">
                        <el-timeline-item
                          v-for="item in scope.row.commentsChildren"
                          :key="item.id"
                          :timestamp="item.createTime|dateFilter"
                          placement="top"
                        >
                          <el-card class="box-card">
                            <div>
                              <b>{{item.user.name}}</b> 回复
                              <b>{{item.userName}}</b>
                              ：
                            </div>
                            <span style="color:#000000" v-html="item.content"></span>
                          </el-card>
                        </el-timeline-item>
                      </el-timeline>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else>
                <Empty />
              </div>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="内容" width="180">
            <template slot-scope="scope">
              <span v-html="$options.filters.strFilter(scope.row.comments[0].content,18)"></span>
            </template>
          </el-table-column>
          <el-table-column prop="news.title" :show-overflow-tooltip="true" label="评论文章" width="180"></el-table-column>
          <el-table-column
            prop="comments[0].createTime"
            :formatter="dateFormat"
            sortable
            label="评论时间"
          ></el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入评论关键字搜索" />
            </template>
            <template slot-scope="scope">
              <!-- 查看按钮 -->
              <el-tooltip effect="dark" content="查看" placement="top" :enterable="false">
                <el-button
                  @click="goNewsDetails(scope.row.news.id)"
                  type="primary"
                  icon="el-icon-view"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button
                  @click="del(scope.row.comments[0].id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px;margin-bottom: 10px;">
          <el-button @click="delAll" size="small" type="danger">删除已选中</el-button>
          <el-button size="small" @click="toggleSelection()">取消选择</el-button>
        </div>

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
      </el-card>
    </div>
  </div>
</template>


<script>
import Empty from "@/components/Empty.vue";

export default {
  components: { Empty },
  data() {
    return {
      multipleSelection: [],
      //查询model
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },
      total: 0,
      //日期筛选器
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      //日期搜索
      value2: "",
      //文本框搜索
      search: "",
      //select选择的id集合
      selectedIdData: [],

      userId: sessionStorage.getItem("userId"),

      //评论
      commentsList: [],
    };
  },
  created() {
    this.getAllByUserId();
  },
  methods: {
    //日期过滤
    async selectEndMonth() {
      if (this.total == 0) {
        this.queryModel.pageSize = this.total;
      } else {
        this.queryModel.pageSize = this.total;
      }
      console.log(typeof this.total);
      console.log(this.total);

      const { data: res } = await this.$http.get(
        "Comment/getAllByUserId?userId=" + this.userId,
        {
          params: this.queryModel,
        }
      );
     
      var starTime = this.$moment(this.value2[0]).format();
      var endTime = this.$moment(this.value2[1]).format();

      var sss = res.data.data.filter(
        (item) =>
          this.$moment(item.comments.createTime).format() > starTime &&
          this.$moment(item.comments.lastChangeTime).format() < endTime
      );

      this.commentsList = sss;
    },
    //获取评论列表
    async getAllByUserId() {
      const { data: res } = await this.$http.get(
        "Comment/getAllByUserId?userId=" + this.userId,
        {
          params: this.queryModel,
        }
      );

      if (res.code !== 200) return this.$message.error("获取评论失败");

      this.commentsList = res.data.data;
      this.total = res.data.dataCount;
     
    },
    //删除评论
    async del(commentId) {
      const confirmResult = await this.$confirm(
        "此操作将此评论永久删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        "Comment/Del?commentId=" + commentId
      );
      if (res.code !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getAllByUserId();
    },
    //批量删除
    async delAll() {
      if (this.selectedIdData.length > 0) {
        const confirmResult = await this.$confirm(
          "此操作将删除已经选中的项, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmResult !== "confirm") {
          this.$refs.multipleTable.clearSelection();
          return this.$message.info("已取消删除");
        }

        for (let index = 0; index < this.selectedIdData.length; index++) {
          const { data: res } = await this.$http.delete(
            "Comment/Del?commentId=" + this.selectedIdData[index].id
          );
        }

        this.$message.success("删除成功");
        this.getAllByUserId();
      } else {
        return this.$message.info("请至少选择一篇");
      }
    },
    //查看详情
    goNewsDetails(newsId) {
      this.$router.push("NewsDetails?newsId=" + newsId);
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row.comments[0].createTime;
      if (date == undefined) {
        return data;
      }
      return this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;
      this.getAllByUserId();
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getAllByUserId();
    },
    //单选
    selectItem(rows) {
      if (rows.length > 1) {
        var newRows = rows.filter((it, index) => {
          if (index == rows.length - 1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
            return true;
          } else {
            this.$refs.multipleTable.toggleRowSelection(it, true);
            return true;
          }
        });
        this.selectedIdData = newRows;
      } else {
        this.selectedIdData = rows;
      }
    },
    onSelectOp(row) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(row, true);
      this.selectedIdData = [];
      this.selectedIdData.push(row);
    },
    //全选/全不选
    toggleSelection(rows) {
      if (rows) {
        return;
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
  },
};
</script>
<style  scoped>
.s {
  background-color: silver;
}
</style>

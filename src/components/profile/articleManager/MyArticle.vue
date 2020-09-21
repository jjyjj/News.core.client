<template>
  <div>
    <div>
      <el-card class="box-card">
        <!-- 搜索与添加文章区域 -->
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
          <el-col :span="4" :offset="10">
            <el-button type="primary" @click="goAddNews">发布新文章</el-button>
          </el-col>
        </el-row>
        <!-- 文章列表区域 -->
        <el-table
          ref="multipleTable"
          :data="newsList.filter(data => !search || data.news.title.toLowerCase().includes(search.toLowerCase()))"
          stripe
          style="width: 100%;margin-top:10px"
          @select-all="toggleSelection"
          @selection-change="selectItem"
          @row-click="onSelectOp"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label>
                  <Empty />
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>

          <el-table-column prop="news.title" label="文章标题" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column
            prop="categories"
            label="类别"
            width="120"
            :filters="filterCategorys"
            :filter-method="filterTag"
            :filter-multiple="false"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag
                type="success"
                style="margin-left:4px"
                disable-transitions
                v-for="item in scope.row.categories"
                :key="item.id"
              >{{item.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="news.createTime"
            label="发布时间"
            :formatter="dateFormat"
            sortable
            width="150"
          ></el-table-column>
          <el-table-column prop="news.browseCOunt" label="浏览次数" sortable width="100" align="center"></el-table-column>

          <el-table-column label="操作" fixed="right" width="180px">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入标题关键字搜索" />
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
              <!-- 修改按钮 -->
              <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button
                  @click="goEdit(scope.row.news.id)"
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip effect="dark" content="移动至回收站" placement="top" :enterable="false">
                <el-button
                  @click="del(scope.row.news)"
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
  inject: ["reload"],
  components: { Empty },
  data() {
    return {
      multipleSelection: [],
      //分页
      queryModel: {
        isPage: true,
        pageIndex: 1,
        pageSize: 4,
      },

      total: 0,
      //日期筛选器

      value2: "",
      search: "",

      userId: sessionStorage.getItem("userId"),
      newsList: [],
      categorys: [],
      filterCategorys: [],

      selectedIdData: [],
      checkedCities: [],
    };
  },
  created() {},
  methods: {
    //日期过滤
    async selectEndMonth() {
      if (this.total == 0) {
        this.queryModel.pageSize = this.total;
      } else {
        this.queryModel.pageSize = this.total;
      }
      const { data: res } = await this.$http.get(
        `News/GetAllByUserId?userId=${this.userId}&&state=0`,
        {
          params: this.queryModel,
        }
      );
      var starTime = this.$moment(this.value2[0]).format();
      var endTime = this.$moment(this.value2[1]).format();

      var sss = res.data.data.filter(
        (item) =>
          this.$moment(item.news.createTime).format() > starTime &&
          this.$moment(item.news.lastChangeTime).format() < endTime
      );

      this.newsList = sss;
    },
    //初始化数据：news绑定
    async getAllByUserId(state) {
      const { data: res } = await this.$http.get(
        `News/GetAllByUserId?userId=${this.userId}&&state=${state}`,
        {
          params: this.queryModel,
        }
      );
      if (res.code !== 200) return this.$message.error("获取文章列表失败");
      this.newsList = res.data.data;
      this.total = res.data.dataCount;
    },
    //初始化数据：类别绑定
    async getAllCategory() {
      const { data: res } = await this.$http.get(`category/getAll`);
      if (res.code !== 200) return this.$message.error("获取类别列表失败");
      this.categorys = res.data;

      for (let index = 0; index < res.data.length; index++) {
        var c = { text: "", value: "" };
        c.text = res.data[index].name;
        c.value = res.data[index].name;
        this.filterCategorys[index] = c;
      }
    },
    //查看详情
    goNewsDetails(newsId) {
      this.$router.push("NewsDetails?newsId=" + newsId);
    },
    //直接发布
    async submit(news, state) {
      const { data: ress } = await this.$http.get(
        "News/GetDetailsById?newsId=" + news.id
      );
      var cates = ress.data.categories;
      for (let index = 0; index < cates.length; index++) {
        this.checkedCities.push(cates[index].id);
      }
      var cateId = this.checkedCities;
      news.state = state;
      const { data: res } = await this.$http.put(`news/update`, {
        news,
        cateId,
      });
      if (res.code !== 200) return this.$message.error(res.msg);
    },
    //移动至回收站文章
    async del(news) {
      const confirmResult = await this.$confirm(
        "此操作将文章移动至回收站, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消移动");

      this.submit(news, 2);
      this.getAllByUserId(0);
      this.$message.success("已成功移动至回收站");
      this.reload();
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

    filterTag(value, row, column) {
      var data = JSON.stringify(row.categories);

      var reg = RegExp(value);
      if (data.match(reg)) {
        return data;
      }
    },
    //全部删除
    async delAll() {
      if (this.selectedIdData.length > 0) {
        const confirmResult = await this.$confirm(
          "此操作将删除已经选中的文章, 是否继续?",
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
            "News/Del?newsId=" + this.selectedIdData[index].news.id
          );
          if (res.code !== 200)
            return this.$message.error(
              `删除id为${this.selectedIdData[index].news.id}的文章失败`
            );
        }

        this.$message.success("删除成功");
        this.getAllByUserId(0);
      } else {
        return this.$message.info("请至少选择一篇");
      }
    },
    //  格式化日期
    dateFormat(row, column) {
      const date = row.news.createTime;
      if (date == undefined) {
        return data;
      }
      return this.$moment(date).format("YYYY-MM-DD  HH:mm:ss");
    },
    //分页
    handleSizeChange(newSize) {
      this.queryModel.pageSize = newSize;
      this.getAllByUserId(0);
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getAllByUserId(0);
    },
    //查看详情
    newsDetails(newsId) {
      this.$router.push("NewsDetails?newsId=" + newsId);
    },
    //编辑文章
    goEdit(newsId) {
      this.$router.push("EditArticle?newsId=" + newsId);
    },
    goAddNews() {
      this.$router.push("AddArticle");
    },
  },
};
</script>
<style  scoped>
.s {
  background-color: silver;
}
</style>

<template>
  <div>
    <div>
      <el-card class="box-card">
        <!-- 搜索与添加文章区域 -->
        <!-- 文章列表区域 -->
        <el-table
          ref="multipleTable"
          :data="newsList.filter(data => !search || data.news.title.toLowerCase().includes(search.toLowerCase()))"
          stripe
          style="width: 100%;"
          @select-all="toggleSelection"
          @selection-change="selectItem"
          @row-click="onSelectOp"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item>
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

          <el-table-column label="时间">
            <el-table-column
              prop="news.createTime"
              label="发布时间"
              :formatter="dateFormat"
              sortable
              width="150"
            ></el-table-column>
            <el-table-column
              prop="news.LastTime"
              label="删除时间"
              :formatter="dateFormat"
              sortable
              width="150"
            ></el-table-column>
          </el-table-column>
          <el-table-column prop="news.browseCOunt" label="浏览次数" sortable width="120" align="center"></el-table-column>

          <el-table-column label="操作" fixed="right" width="180px">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入标题关键字搜索" />
            </template>
            <template slot-scope="scope">
              <!-- 修改按钮 -->
              <el-tooltip effect="dark" content="还原" placement="top" :enterable="false">
                <el-button
                  @click="refresh(scope.row.news,1)"
                  type="warning"
                  icon="el-icon-refresh"
                  size="mini"
                ></el-button>
              </el-tooltip>
              <!-- 删除按钮 -->
              <el-tooltip effect="dark" content="永久删除" placement="top" :enterable="false">
                <el-button
                  @click="del(scope.row.news.id)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 10px;margin-bottom: 10px;">
          <el-button @click="refreshAll" size="small" type="warning">批量还原</el-button>
          <el-button @click="delAll" size="small" type="danger">批量删除</el-button>
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
      input3: "",
      select: "",
      multipleSelection: [],
      //分页
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
      value1: "",
      value2: "",
      search: "",

      userId: sessionStorage.getItem("userId"),
      newsList: [],
      categorys: [],
      filterCategorys: [],

      selectedIdData: [],  checkedCities: [],
    };
  },
  created() {},
  methods: {
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
      this.$emit("recycleBinTotal", this.total);
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

    //还原文章
    async refresh(news, state) {
      const confirmResult = await this.$confirm(
        "此操作将文章还原至草稿箱, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消还原");
      console.log(news);
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

      this.getAllByUserId(2);
    },
    async del(newsId) {
      const confirmResult = await this.$confirm(
        "此操作将文章永久删除并不可还原, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$http.delete(
        "News/Del?newsId=" + newsId
      );
      if (res.code !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getAllByUserId(2);
    },

    //批量还原
    async refreshAll() {
      if (this.selectedIdData.length > 0) {
        const confirmResult = await this.$confirm(
          "此操作将还原已经选中的文章, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmResult !== "confirm") {
          this.$refs.multipleTable.clearSelection();
          return this.$message.info("已取消还原");
        }

        // for (let index = 0; index < this.selectedIdData.length; index++) {
        //   const { data: res } = await this.$http.delete(
        //     "News/Del?newsId=" + this.selectedIdData[index].news.id
        //   );
        //   if (res.code !== 200)
        //     return this.$message.error(
        //       `删除id为${this.selectedIdData[index].news.id}的文章失败`
        //     );
        // }

        this.$message.success("还原成功");
        this.getAllByUserId(2);
      } else {
        return this.$message.info("请至少选择一篇");
      }
    },
    //批量删除
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
        this.getAllByUserId(2);
      } else {
        return this.$message.info("请至少选择一篇");
      }
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
    //类别筛选
    filterTag(value, row) {
      var data = JSON.stringify(row.categories);

      var reg = RegExp(value);
      if (data.match(reg)) {
        return data;
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
      this.getAllByUserId(2);
    },
    handleCurrentChange(newPage) {
      this.queryModel.pageIndex = newPage;
      this.getAllByUserId(2);
    },
  },
};
</script>
<style  scoped>
.s {
  background-color: silver;
}
</style>

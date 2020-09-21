<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我的文章" name="0">
        <span slot="label">
          <el-badge class="item" :hidden="true">我的文章</el-badge>
        </span>
        <div>
          <MyArticle ref="myArticle" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="草稿箱" name="1">
        <span slot="label">
          <el-badge :value="drafts" :max="99" class="item" :hidden="drafts<=0">草稿箱</el-badge>
        </span>
        <div>
          <Drafts @draftsTotal="draftsSonData" ref="drafts" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="回收站" name="2">
        <span slot="label">
          <el-badge :value="recycleBin" :max="99" class="item" :hidden="recycleBin<=0">回收站</el-badge>
        </span>
        <div>
          <RecycleBin @recycleBinTotal="recycleBinSonData" ref="recycleBin" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MyArticle from "@/components/profile/articleManager/MyArticle.vue";
import Drafts from "@/components/profile/articleManager/Drafts.vue";
import RecycleBin from "@/components/profile/articleManager/RecycleBin.vue";

export default {
  components: {
    MyArticle,
    Drafts,
    RecycleBin,
  },
  data() {
    return {
      activeName: "0",
      drafts: 0, //草稿箱文章数量
      recycleBin: 0, //回收站文章数量
    };
  },
  created() {
   
    this.draftsSonData();
  },
  methods: {
    myArticleCategoty() {
      this.$refs.myArticle.getAllByUserId(0);
      this.$refs.myArticle.getAllCategory();
    },
    draftsSonData(data) {
      this.drafts = data;
    },
    recycleBinSonData(data) {
      this.recycleBin = data;
    },
    handleClick(tab, event) {
      var name = tab.label;
      if (name == "我的文章") {
        this.$refs.myArticle.getAllByUserId(0);
        this.$refs.myArticle.getAllCategory();
      }
      if (name == "草稿箱") {
        this.$refs.drafts.getAllByUserId(1);
        this.$refs.drafts.getAllCategory();
      }
      if (name == "回收站") {
        this.$refs.recycleBin.getAllByUserId(2);
        this.$refs.recycleBin.getAllCategory();
      }
    },
  },
};
</script>
<style  scoped>
.item {
  margin-top: 9px;
}
</style>

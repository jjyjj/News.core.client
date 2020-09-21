<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <b>专栏</b>&#12288;
        <i class="el-icon-document" style="font-size: 20px;"></i>
      </div>
      <div>
        <el-row>
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-avatar
                style="width:30px;height:30px"
                src="http://localhost:8510//Files/Pictures/users/2020-09-15-eee042b6-37a0-4c52-8ef1-c9bf1a6d36ea.jpg"
              ></el-avatar>
            </div>
          </el-col>
          <el-col :span="15">杂志</el-col>
          <el-col :span="4">5</el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},

  inject: ["reload"],
  data() {
    return {
      queryModel: {
        isPage: true,
        pageIndex: 1, 
        pageSize: 5,
      },
    };
  },
  created() {},
  computed: {},
  methods: {},
  mounted() {},
};
</script>
<style  scoped>
.el-col > div > ul > li {
  margin-top: 5px;
}
</style>

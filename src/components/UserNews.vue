<template>
  <div>
    <el-card class="box-card" style="margin:15px 0" shadow="never">
      <div>
        <el-row :gutter="20">
          <el-col :span="2">
            <div class="grid-content bg-purple">
              <div class="demo-type">
                <div>
                  <el-avatar :size="65"></el-avatar>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="22">
            <div class="grid-content bg-purple">
              <div>
                <b>{{}}</b>
                <el-tooltip class="item" effect="dark" content="发送邮件" placement="top">
                  <el-button icon="el-icon-message" circle style="float:right"></el-button>
                </el-tooltip>
              </div>
              <div style="margin-top:20px;font-size:15px;color:#8c8c8c">
                共发布了
                <b>{{}}&nbsp;</b>篇文章
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {},
};
</script>


<style  scoped>
</style>

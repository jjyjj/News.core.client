<template>
  <div>
    <!-- 个人资料 -->

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <b>
          <span>个人资料</span>
        </b>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-image
                style="width: 100px; height: 100px; border-radius:50%"
                :src="previewPath"
                fit="fill"
              ></el-image>
              <el-upload
                :action="uploadURL"
                :on-success="handleSuccess"
                list-type="picture"
                :show-file-list="false"
              >
                <el-button
                  style="margin:5px 0px 0px 20px "
                  type="text"
                  @click="headDialogVisible = true"
                >修改头像</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="20">
            <div class="grid-content bg-purple">
              <div style="height: 20%;">
                <el-alert title type="info" :closable="false">唯一标示号：{{userInfo.id}}</el-alert>

                <el-alert type="info" :closable="false">
                  <b>
                    关注数：
                    <span>12</span>
                  </b>
                  <b style="margin-left:20px">
                    粉丝数：
                    <span></span>
                  </b>
                </el-alert>
              </div>
              <el-button type="text" style="float:right" @click="showEditDialog(userInfo.id)">修改资料</el-button>

              <div class="zl" style="height: 80%;">
                <div>
                  <b>
                    昵称：
                    <span>{{userInfo.name?userInfo.name:'空'}}</span>
                  </b>
                </div>

                <div>
                  <b>
                    性别：
                    <span>{{userInfo.sex>0?'女':'男'}}</span>
                  </b>
                </div>
                <div>
                  <b>
                    生日：
                    <span>{{userInfo.birthday?userInfo.birthday:'空'}}</span>
                  </b>
                </div>
                <div>
                  <b>
                    邮箱：
                    <span>{{userInfo.email}}</span>
                  </b>
                </div>
                <div>
                  <b>
                    手机号：
                    <span>{{userInfo.phone?userInfo.phone.substr(0, 3) + '****' + userInfo.phone.substr(7):'暂无'}}</span>
                  </b>
                </div>
                <div>
                  <b>
                    地址:
                    <span>{{userInfo.adress?userInfo.adress:'空'}}</span>
                  </b>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 修改头像对话框 -->

    <!-- 修改资料对话框 -->
    <el-dialog
      resizable="false"
      title="修改资料"
      :visible.sync="infoDialogVisible"
      width="30%"
      :before-close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form ref="editFormRef" label-width="70px" :model="editForm" :rules="editFormRules">
        <el-form-item label="昵称">
          <el-input v-model="editForm.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="editForm.sex" label="0" border>男</el-radio>
          <el-radio v-model="editForm.sex" label="1" border>女</el-radio>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.birthday"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editForm.adress" clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditDialog(userInfo.id)">恢复初始值</el-button>
        <el-button type="primary" @click="editUserInfo">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { emailValid, mobileValid } from "../../comment.js";

export default {
  components: {},
  data() {
    return {
      headDialogVisible: false,

      //修改用户信息
      infoDialogVisible: false,
      editForm: {},
      editFormRules: {
        email: emailValid,
        phone: mobileValid,
      },
      userInfo: {},

      //上传图片
      uploadURL: "http://localhost:8510/CommonMethods/Post?types=1",
      // 请求头,携带token
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 图片地址
      previewPath: "",

      url: "http://localhost:8510/",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    editAvater() {},
    //获取用户信息
    async getUserInfo() {
      const { data: res } = await this.$http.get(
        "User/GetOneById?userId=" + sessionStorage.getItem("userId")
      );
      if (res.code !== 200) return this.$message.error(res.msg);
      this.userInfo = res.data;
      this.previewPath = this.url + res.data.imgUrl;
      console.log(this.previewPath);
    },
    //修改用户
    //打开修改面板并展示初始数据
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        "User/GetOneById?userId=" + id
      );
      if (res.code !== 200) return this.$message.error("获取用户信息失败");

      this.editForm = res.data;
      this.infoDialogVisible = true;
      this.$message.success("获取用户成功");
    },
    //发起修改请求
    editUserInfo() {
      this.$refs.editFormRef.validate(async (validate) => {
        if (!validate) return;
        const { data: res } = await this.$http.put(
          "User/Update",
          this.editForm
        );
        if (res.code !== 200) return this.$message.error("更新用户信息失败");
        this.infoDialogVisible = false;
        this.getUserInfo();
        this.$message.success("更新用户信息成功");
      });
    },
    //修改头像

    //重置修改表单
    editDialogClosed() {
      this.$confirm("确认关闭？")
        .then((_) => {
          this.resetFields();
          this.infoDialogVisible = false;
        })
        .catch((_) => {});
    },
    resetFields() {
      this.$refs.editFormRef.resetFields();
    },

    //超出limit的回调
    Exceed() {},
    // 处理图片预览效果

    // 监听图片上传成功的事件
    async handleSuccess(response) {
      //删除原来的图片
      var filePath = this.userInfo.imgUrl;
      const { data: ress } = await this.$http.delete(
        "CommonMethods/Delete?filePath=" + filePath
      );
      if (ress.code !== 200) return;
      else {
        this.userInfo.imgUrl = response.data[0];
        const { data: res } = await this.$http.put(
          "User/Update",
          this.userInfo
        );
        if (res.code !== 200) return this.$message.error("更新用户信息失败");
        this.getUserInfo();
        this.$message.success("更新用户信息成功");
      }
    },
  },
};
</script>
<style  scoped>
.el-tag {
  margin-left: 10px;
}
.el-avatar {
  width: 100px;
  height: 100px;
}
.zl > div {
  margin-top: 20px;
}
.wz {
  margin-top: 15px;
}
.el-upload {
  display: block;
}
.el-upload-dragger {
  width: 100%;
}
.sssssss {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>

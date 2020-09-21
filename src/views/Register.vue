<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <!-- 注册表单 -->
      <div>
        <el-card class="box-card" shadow="never">
          <el-row type="flex" class="row-bg" justify="center" :gutter="20">
            <el-col :span="10">
              <div class="grid-content bg-purple">
                <el-form
                  ref="addUserFormRef"
                  :model="addUserForm"
                  :rules="addUserFormRules"
                  label-width="80px"
                >
                  <el-form-item prop="Email" label="邮箱:">
                    <el-input show-word-limit v-model="addUserForm.Email"></el-input>
                  </el-form-item>

                  <el-form-item label="密码:" prop="PassWord">
                    <el-input placeholder="请输入密码" v-model="addUserForm.PassWord" show-password></el-input>
                  </el-form-item>
                  <el-form-item prop="Code" label="验证码:">
                    <el-input
                      placeholder="请输入验证码"
                      v-model="addUserForm.Code"
                      class="input-with-select"
                    >
                      <img :src="codeUrl" alt="看不清？点击更换" slot="append" @click="reCode" />
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="loginButton" type="primary" @click="addUser">立即创建</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button class="loginButton" @click="goLogin">返回登录</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-main>
    <el-container>
      <el-footer>
        <Footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Top from "@/components/Top.vue";
import Footer from "@/components/Footer.vue";
import { emailValid, passwordValid } from "../comment.js";

export default {
  components: {
    Top,
    Footer,
  },
  data() {
    return {
      addUserForm: {
        Email: "",
        PassWord: "",
        Code: "",
      },
      addUserFormRules: {
        Email: emailValid,
        PassWord: passwordValid,
      },
      codeUrl: "http://localhost:8510/user/ValidateCode",
    };
  },
  created() {},
  methods: {
    //刷新验证码
    reCode() {
      this.codeUrl = this.codeUrl + "?1";
    },
    //返回登录
    goLogin() {
      this.$router.push({ path: "/Login" });
    },

    //注册用户
    addUser() {
      this.$refs.addUserFormRef.validate(async (validate) => {
        if (!validate) return;
        const { data: res } = await this.$http.post(
          "User/Add",
          this.addUserForm
        );
        if (res.code !== 200) return this.$message.error(res.msg);
        else {
          this.$message.success("注册成功，3秒后返回登录界面");
          setTimeout(() => {
            this.goLogin();
          }, 3000);
        }
        this.$refs.addUserFormRef.resetFields();
      });
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
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 10%;
}

.cardMian {
  width: 50%;
  margin: 0 auto;
}
.loginButton {
  width: 100%;
}
.input-with-select /deep/.el-input-group__append {
  padding-right: 0px;
  padding-left: 0px;
  border: 0;
}
</style>

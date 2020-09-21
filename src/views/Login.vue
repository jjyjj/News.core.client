<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <div>
        <el-row :gutter="15">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-card class="box-card" shadow="hover">
                <div></div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple animate__animated animate__fadeIn animate__delay-1s">
              <el-card class="box-card" shadow="hover">
                <div>
                  <el-tabs
                    v-model="activeName"
                    type="card"
                    @tab-click="handleClick"
                    :stretch="true"
                  >
                    <el-tab-pane label="邮箱登录" name="first">
                      <!-- 登录表单区域 -->
                      <el-form
                        ref="loginFormRef"
                        :model="loginForm"
                        :rules="loginFormRules"
                        label-width="0px"
                        class="login-form"
                      >
                        <!-- 用户名 -->
                        <el-form-item prop="Email" class="demo-input-suffix">
                          <el-input
                            v-model="loginForm.Email"
                            prefix-icon="iconfont icon-user"
                            placeholder="邮箱"
                            clearable
                          >
                            <i slot="prefix" class="el-input__icon el-icon-user"></i>
                          </el-input>
                        </el-form-item>
                        <!-- 密码 -->
                        <el-form-item prop="PassWord">
                          <el-input
                            v-model="loginForm.PassWord"
                            type="password"
                            prefix-icon="iconfont icon-lock_fill"
                            placeholder="密码"
                            :show-password="true"
                          >
                            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                          </el-input>
                        </el-form-item>
                        <el-form-item>
                          <div style="float:right">
                            <router-link to="/forget">忘记密码</router-link>
                          </div>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="手机号登录" name="second">
                      <el-form ref="phoneFormRef" :model="phoneForm" label-width="5px">
                        <el-form-item label>
                          <el-row :gutter="10">
                            <el-col :span="8">
                              <div class="grid-content bg-purple">
                                <el-select v-model="phoneForm.area" placeholder="请选择">
                                  <el-option
                                    v-for="item in areas"
                                    :key="item.value"
                                    :label="item.number"
                                    :value="item.value"
                                    :disabled="item.disabled"
                                  >
                                    <span style="float: left">{{ item.number }}</span>
                                    <span style="float: left;margin-left:10px">{{ item.label }}</span>
                                  </el-option>
                                </el-select>
                              </div>
                            </el-col>
                            <el-col :span="16">
                              <div class="grid-content bg-purple">
                                <el-input
                                  placeholder="请输入合法手机号"
                                  v-model="phoneForm.phone"
                                  clearable
                                  class="input-with-select"
                                ></el-input>
                              </div>
                            </el-col>
                          </el-row>
                        </el-form-item>
                        <el-form-item>
                          <el-input
                            placeholder="请输入验证码"
                            v-model="phoneForm.code"
                            class="input-with-select"
                          >
                            <el-button slot="append">获取验证码</el-button>
                          </el-input>
                        </el-form-item>
                      </el-form>
                    </el-tab-pane>
                    <div>
                      <el-button class="loginButton" type="primary" @click="login">登录</el-button>
                    </div>
                    <br />
                    <div>
                      <router-link to="/register">
                        <el-button class="loginButton" type>没有账号,前往注册</el-button>
                      </router-link>
                    </div>
                  </el-tabs>
                </div>
                <div style="position:absolute;bottom:25px;">
                  快速登录：
                  <el-tooltip content="qq" placement="top">
                    <el-tag type="success">
                      <img class="cicleImg" src="../assets/image/qq.svg" alt />
                    </el-tag>
                  </el-tooltip>

                  <el-tooltip content="微信" placement="top">
                    <el-tag type="success">
                      <img class="cicleImg" src="../assets/image/wx.svg" alt />
                    </el-tag>
                  </el-tooltip>
                  <el-tooltip content="微博" placement="top">
                    <el-tag type="success">
                      <img class="cicleImg" src="../assets/image/wb.svg" alt />
                    </el-tag>
                  </el-tooltip>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
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
      activeName: "first",
      //账号密码登录
      loginForm: {
        Email: "",
        PassWord: "",
      },
      loginFormRules: {
        Email: emailValid,
        PassWord: passwordValid,
      },
      //手机号登录
      phoneForm: {
        phone: "",
        code: "",
        phoneSelect: "",
        area: "",
      },

      areas: [
        {
          value: "0",
          number: "+ 86",
          label: "中国",
        },
        {
          value: "1",
          number: "+ 1",
          label: "美国",
        },
        {
          value: "2",
          number: "+ 1",
          label: "加拿大",
        },
        {
          value: "3",
          number: "+ 852",
          label: "中国香港",
        },
      ],
    };
  },
  methods: {
    //登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "login/login",
          this.loginForm
        );

        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success("登录成功");
        // 1. 将登录成功之后的token,保存到客户端的sessionStorage中
        //  1.1 项目中除了登录之外的其他API接口,必须在登录之后才能访问
        //  1.2 token只应在当前网站打开期间生效,所以将token保存到sessionStorage中
        //获取缓存的token
        window.sessionStorage.setItem("token", res.data.access_token);
        window.sessionStorage.setItem("userId", res.data.profile.id);
        window.sessionStorage.setItem("userEmail", res.data.profile.email);
        window.sessionStorage.setItem("userName", res.data.profile.name);
        // // 2. 通过编程式导航跳转到主页
        this.$router.push("/");
      });
    },
    handleClick(tab, event) {},
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
.fontsize {
  font-size: 15px;
  color: #a3a3a3;
}
.box-card {
  width: 450px;
  height: 450px;
  margin: 20px;
}
.el-tabs {
  width: 80%;
  margin: 30px auto;
}
.loginButton {
  width: 100%;
}
.cicleImg {
  width: 25px;
  height: 25px;
}
.el-tag {
  margin-left: 10px;
}

.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>
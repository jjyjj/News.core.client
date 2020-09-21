<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <div>
        <el-card class="box-card" shadow="never">
          <el-tag>
            <i class="el-icon-arrow-left">
              <router-link to="/login">返回登录</router-link>
            </i>
          </el-tag>

          <el-card class="box-card cardMian" shadow="hover">
            <div slot="header" class="clearfix">
              <span>通过邮箱找回密码</span>
            </div>
            <div>
              <!-- 通过邮箱找回密码 -->
              <el-form
                ref="passwordForEmailFormRef"
                :rules="passwordForEmailFormRules"
                label-width="0px"
                class="login-form"
              >
                <!-- 邮箱 -->
                <el-form-item prop="email" class="demo-input-suffix">
                  <el-input
                    v-model="passwordForEmailForm.email"
                    prefix-icon="iconfont icon-user"
                    placeholder="邮箱"
                    clearable
                  ></el-input>
                </el-form-item>
                <!-- 验证码 -->
                <el-form-item>
                  <div style="margin-top: 15px;">
                    <el-input placeholder="请输入验证码">
                      <el-button slot="append">获取验证码</el-button>
                    </el-input>
                  </div>
                </el-form-item>

                <!-- 按钮 -->
                <el-form-item>
                  <el-button class="loginButton" type="primary">确认</el-button>
                </el-form-item>
              </el-form>

              <!-- 通过用户名找回密码 -->
              <!-- 通过手机号找回密码 -->

              <div>
                <el-divider>其他找回密码方式</el-divider>
                <div>
                  <el-tag type="info">用户名找回</el-tag>
                  <el-tag type="info">手机号找回</el-tag>
                  <el-tag type="info">邮箱找回</el-tag>
                </div>
              </div>
            </div>
          </el-card>
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
import { emailValid } from "../comment.js";
export default {
  components: {
    Top,
    Footer,
  },
  data() {
    return {
      activeName: "first",
      // 表单数据绑定对象
      passwordForEmailForm: {
        email: "",
      },
      // 表单的规则验证对象
      passwordForEmailFormRules: {
        email: emailValid,
      },
    };
  },
};
</script>

<style   scoped>
.el-header {
  padding: 0;
  background-color:#2e3033;
}
.el-main {
  width: 65%;
  margin: 0 auto;

  min-height: 636px;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 10%;
  padding: 0;
}
.cardMian {
  width: 50%;
  margin: 0 auto;
}
.el-button {
  width: 100%;
}
.el-tag {
  margin-left: 10px;
}
</style>
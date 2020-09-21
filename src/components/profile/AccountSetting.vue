<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="修改密码" name="0">
        <div>
          <el-form
            :model="ChangPassWordForm"
            status-icon
            :rules="ChangPassWordRules"
            ref="ChangPassWordRef"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="输入旧密码" prop="oldPass">
              <el-input
                type="password"
                v-model="ChangPassWordForm.oldPass"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="输入新密码" prop="newPass">
              <el-input
                type="password"
                v-model="ChangPassWordForm.newPass"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="ChangPassWordForm.checkPass"
                show-password
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="updatePas">确 认</el-button>
              <el-button @click="resetForm('ChangPassWordRuleForm')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="更换手机" name="1">
        <el-row>
          <el-col :span="13" :offset="6">
            <div class="grid-content bg-purple-light">
              <div>
                <span>
                  验证码将发送到手机
                  <span>{{this.userInfo.phone}}</span>
                </span>
                <br />
                <br />
                <el-alert title="如果长时间未收到验证码，请检查是否将运营商拉黑" type="info" :closable="false"></el-alert>
                <br />
              </div>
              <el-form
                ref="ChangTelFormRef"
                label-width="70px"
                :model="ChangTelForm"
                :rules="ChangTelFormRules"
              >
                <el-form-item label="新手机号:" prop="mobile" v-if="newPhone">
                  <el-input v-model="ChangTelForm.mobile" clearable></el-input>
                </el-form-item>

                <el-form-item label="验证码：">
                  <div>
                    <el-input placeholder="请输入验证码" v-model="code" class="input-with-select">
                      <el-button slot="append">获取短信验证码</el-button>
                    </el-input>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="newPhone=!newPhone">下一步</el-button>
                  <el-button type="primary">确 定</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="更换邮箱" name="2">
        <el-row>
          <el-col :span="13" :offset="6">
            <div class="grid-content bg-purple-light">
              <div>
                <span>
                  验证码将发送到邮箱
                  <span>35****</span>
                </span>
                <br />
                <br />
                <el-alert title="如果长时间未收到验证码，请检查垃圾箱" type="info" :closable="false"></el-alert>
                <br />
              </div>
              <el-form
                ref="ChangEmailFormRef"
                label-width="70px"
                :model="ChangEmailForm"
                :rules="ChangEmailFormRules"
              >
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ChangEmailForm.email" clearable></el-input>
                </el-form-item>

                <el-form-item label="验证码：">
                  <div>
                    <el-input placeholder="请输入验证码" v-model="code" class="input-with-select">
                      <el-button slot="append">获取验证码</el-button>
                    </el-input>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary">下一步</el-button>
                  <el-button type="primary">确 定</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="登录日志" name="3">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180"></el-table-column>

          <el-table-column prop="address" label="地址"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mobileValid, emailValid } from "../../comment.js";
export default {
  inject: ["reload"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ChangPassWordForm.checkPass !== "") {
          this.$refs.ChangPassWordRef.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ChangPassWordForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      newPhone: false,
      code: "",
      activeName: "0",
      //修改密码
      ChangPassWordForm: {
        oldPass: "",
        newPass: "",
        checkPass: "",
      },
      ChangPassWordRules: {
        newPass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
        oldPass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
      },
      //修改手机号
      ChangTelForm: {},
      ChangTelFormRules: {
        mobile: mobileValid,
      },
      //修改邮箱
      ChangEmailForm: {},
      ChangEmailFormRules: {
        email: emailValid,
      },
      //登陆日志
      tableData: [
        {
          date: "2020-05-04 14:16",

          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2020-05-04 14:16",

          address: "上海市普陀区金沙江路 1517 弄",
        },
      ],

      userInfo: [],
      userId: parseInt(sessionStorage.getItem("userId")),
    };
  },
  created() {
    this.getOneUser();
  },
  methods: {
    //初始化
    async getOneUser() {
      const { data: res } = await this.$http.get(
        "User/GetOneById?userId=" + this.userId
      );
      if (res.code !== 200) return;
      this.userInfo = res.data;
      this.ChangPassWordForm.oldPass = this.userInfo.passWord;
      console.log(this.userInfo);
    },
    //修改密码
    updatePas() {
      this.$refs.ChangPassWordRef.validate(async (valid) => {
        if (!valid) return;

        this.userInfo.passWord = this.ChangPassWordForm.newPass;
        const { data: res } = await this.$http.put(
          "User/Update",
          this.userInfo
        );
        if (res.code !== 200) return this.$message.error("修改密码失败");
        window.sessionStorage.clear();
      });
    },
    handleClick(tab, event) {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style scoped>
.el-select .el-input {
  width: 130px;
}
.demo-ruleForm {
  width: 60%;
  margin: 0 auto;
}
</style>

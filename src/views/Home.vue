<template>
  <el-container class="home-container">
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <!-- 前置 -->
      <div class="front">
        <h1 class="ssss">
          <p
            class="p1 animate__animated animate__fadeInLeft animate__delay-1s"
          >Everyone's way of life is different,</p>
          <p
            class="p1 animate__animated animate__fadeInRight animate__delay-1s"
          >as long as you are happy,</p>
          <p
            class="p1 animate__animated animate__fadeInLeft animate__delay-1s"
          >everything is worth it。</p>
          <p
            class="p2 animate__animated animate__fadeInRight animate__delay-1s"
          >每个人的活法都不一样，只要你开心，一切都值得。</p>
          <a class="sa" @click="goContent">
            <div class="animate__animated animate__fadeInDown animate__delay-1s">
              <i style="font-size: 45px;" class="el-icon-arrow-down"></i>
              <p>scroll</p>
            </div>
          </a>
        </h1>
      </div>
      <!-- 内容 -->
      <div class="content">
        <News />
      </div>
    </el-main>
    <el-footer>
      <Footer />
    </el-footer>
  </el-container>
</template>

<script>
import Bus from "../assets/bus.js";
import Top from "@/components/Top.vue";

import Footer from "@/components/Footer.vue";
import News from "@/components/News.vue";

export default {
  components: {
    Top,
    Footer,

    News,
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    goContent() {
      const test = document.querySelector(".content");
      test.scrollIntoView({ behavior: "smooth" });
    },
  },
};
</script>
<style   scoped>
.el-header,
.el-footer {
  background-color: #2e3033;
  color: #cccccc;
  text-align: center;
  line-height: 60px;
  padding: 0;
}

.el-main {
  background-color: #cccccc;
  color: #333;
  text-align: center;
  height: auto;
  padding: 0;
}

.front {
  background-image: url("../assets/bg.jpg");
  width: 100%;
  height: 700px;
  background-size: 100% 100%;
  position: relative;
}

.ssss {
  position: absolute;
  top: 50%;
  left: 51%;
  z-index: 2;
  transform: translate(-50%, -50%);
}
.p1 {
  font: normal 300 30px/1 Josefin Sans, sans-serif;
  color: #000000;
  text-align: center;
  white-space: nowrap;
  margin-top: 10px;
  text-shadow: 0 0 0px rgba(0, 0, 0, 0.8);
}
.p2 {
  font: normal 300 30px/1 Josefin Sans, sans-serif;
  color: #000000;
  text-align: center;
  white-space: nowrap;
  margin-top: 20px;
  font-size: 15px;
  text-shadow: 0 0 0px rgba(0, 0, 0, 0.8);
}
.sa {
  position: absolute;
  top: 140%;
  left: 49%;
  z-index: 2;
  transform: translate(-50%, -50%);
  padding: 10px 20px;
}

.content {
  height: auto;
  background-color: #000000;
}
</style>

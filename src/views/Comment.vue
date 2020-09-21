<template>
  <div>
    <el-header>
      <Top />
    </el-header>
    <el-main>
      <div>
        <el-card class="box-card ss" shadow="never">
          <div id="vcomments"></div>
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

export default {
  components: {
    Top,
    Footer,
  },
  data() {
    return {
      
      Valine: "",
    };
  },
  mounted() {
    import("valine").then((res) => {
      this.Valine = res.default;
      this.init();
    });
  },
  methods: {
    init() {
      new this.Valine({
        el: "#vcomments",
        appId: "SpztRdMolCD55XSjYV4cKAW3-gzGzoHsz",
        appKey: "514e0d7YWYGJvRV7SejqtVK1",
        avatar: "robohash",
        placeholder: "留下你想说的话吧^_^",
        meta:['nick','mail'],
        visitor:true,
        enableQQ:true
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

  min-height: 636px;
  background-color: #cccccc;
}
.ss{
    margin: 0 auto;
    width: 63%;
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
</style>
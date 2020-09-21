<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editorElem",
  props: [ "content"],
  data() {
    return {
      editorContent: "",
      uploading:
        process.env.baseUrl + "/anonVerify/account/file/wangEditorUpload",
      editor: null,
    };
  },

  created() {},
  watch: {
    content() {
      this.editor.txt.html(this.content);
    },
  },
  methods: {},

  mounted() {
    this.editor = new E(this.$refs.editorElem);
    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html;
       this.$emit("sendmsg", this.editorContent);
       // 把这个html通过catchData的方法传入父组件
    };
 
  
    this.editor.create();
    let eds = document.getElementsByClassName("w-e-text-container");
    eds[0].style = eds[0].style.cssText + "height: 500px";
    this.editor.txt.html(this.content);
  },
};
</script>
<style  scoped>
</style>

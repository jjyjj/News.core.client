<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left;"></div>
  </div>
</template>

<script>
import E from "wangeditor";
export default {
  name: "editorElem",
  data() {
    return {
      editorContent: "",
      uploading:
        process.env.baseUrl + "/anonVerify/account/file/wangEditorUpload",
      editor: null,
    };
  },

  created() {
    this.editorContent = this.content;
  },
  watch: {
    content() {
      this.editor.txt.html(this.content);
    },
  },
  methods: {},

  mounted() {
    this.editor = new E(this.$refs.editorElem); //创建富文本实例

    this.editor.customConfig.onchange = (html) => {
      this.editorContent = html;
      this.$emit("sendmsg", this.editorContent);
      //   this.catchData(html); //把这个html通过catchData的方法传入父组件
    };
    // this.editor.customConfig.uploadImgServer = this.uploading;
    // this.editor.customConfig.uploadFileName = "file";
    // editor.customConfig.uploadImgHeaders = {
    //   Accept: '*/*',
    //   Authorization: 'Bearer ' + token //头部token
    // }

    this.editor.create();
    let eds = document.getElementsByClassName("w-e-text-container");
    eds[0].style = eds[0].style.cssText + "height: 500px";
    this.editor.txt.html(this.content);
   
  },
};
</script>
<style  scoped>
</style>

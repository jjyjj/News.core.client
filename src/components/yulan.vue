<template>
    <div v-html="content" @input="result" id="editor">
    </div>
</template>

<script>
import WangEditor from 'wangeditor'
export default {
    props: ['content'],
    data() {
        return {
            editor: ''
        }
    },
    mounted() {
        const editor = new WangEditor('editor')
      
        
        editor.create()
        this.editor = editor
    },
    methods: {
        result() {
            this.$emit('input', this.editor.$txt.html())
        }
    }
}
</script>
<style scoped>
#editor {
    height: 440px;
}

.wangEditor-container {
    border-radius: 2px;
    overflow: hidden;
    border: 1px solid #CCC;
}
</style>

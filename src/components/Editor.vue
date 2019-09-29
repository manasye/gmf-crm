<template>
  <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption"></quill-editor>
</template>

<script>
export default {
  name: "editor",
  data() {
    return {
      content: "<h2>I am Example</h2>",
      editorOption: {
        // some quill options
      }
    };
  }
};
</script>

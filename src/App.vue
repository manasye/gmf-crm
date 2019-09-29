<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
      <quill></quill>
    </div>
    <router-view />
  </div>
</template>

<script>
import quill from "@/components/Editor.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    quill
  }
};
</script>

<style></style>

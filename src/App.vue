<template>
  <div id="app">
    <div id="nav">
      <navbar></navbar>
    </div>
    <router-view />
    <chat></chat>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Chat from "@/components/Chat.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    Navbar,
    Chat
  }
};
</script>

<style></style>

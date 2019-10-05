<template>
  <div id="app">
    <div id="nav">
      <navbar></navbar>
    </div>
    <b-container fluid class="container-app"><router-view /></b-container>
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

<style>
@font-face {
  font-family: "circularstd";
  src: url("./assets/font/CircularStd-Book.otf");
}
@font-face {
  font-family: "circularstd";
  src: url("./assets/font/CircularStd-Bold.otf");
  font-weight: bold;
}
body {
  font-family: "circularstd", sans-serif !important;
}
h1, h2 {
  font-weight: bold !important;
}
.container-app {
  padding: 30px !important;
}
@media (max-width: 700px) {
  .container-app {
    padding: 20px 10px !important;
  }
}
</style>

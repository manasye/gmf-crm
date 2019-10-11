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
  max-width: 100vw;
  overflow-x: hidden;
}
h1,
h2 {
  font-weight: bold !important;
}
.container-app {
  padding: 30px !important;
}
.page-item.active .page-link {
  background-color: #7ebe42 !important;
  border-color: #7ebe42 !important;
}
img {
  max-width: 100%;
}
@media (max-width: 700px) {
  .container-app {
    padding: 20px 10px !important;
  }
  h2 {
    font-size: 1.5rem !important;
  }
  p {
    font-size: 0.9rem;
    margin-bottom: 0.5rem !important;
  }
}
</style>

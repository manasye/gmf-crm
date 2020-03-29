<template>
  <div id="app">
    <div id="nav" v-if="$route.name !== 'login'">
      <navbar />
    </div>
    <router-view />
    <chat v-if="getRole() === 'Customer'" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Chat from "@/components/Chat.vue";
import axios from "axios";

export default {
  name: "app",
  mounted() {},
  data() {
    return {};
  },
  components: {
    Navbar,
    Chat
  },
  computed: {
    activeRoute() {
      return this.$route.name || "";
    }
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
  changesrc: url("./assets/font/CircularStd-Bold.otf");
  font-weight: bold;
}
body {
  font-family: "circularstd", sans-serif !important;
  overflow-x: hidden;
  /* min-height: 100.1vh; */
}
.sc-chat-window {
  z-index: 3;
}
h1,
h2 {
  font-weight: bold !important;
}
.container-app {
  padding: 30px !important;
  margin-top: 65px;
}
.page-item.active .page-link,
.btn-success {
  background-color: #7ebe42 !important;
  border-color: #7ebe42 !important;
}
.btn-primary {
  background-color: #016299 !important;
  border-color: #016299 !important;
}
.badge-warning {
  color: white !important;
}
.sc-chat-window {
  z-index: 2000 !important;
}

img {
  max-width: 100%;
}

.preview-popup {
  height: 50vh;
  background-size: cover;
}

.preview-text-ads {
  position: absolute;
  top: 20%;
  text-align: center;
  width: 500px;
}

.modal-no-padding {
  padding: 0 !important;
}

.b-table td,
.b-table th {
  white-space: nowrap;
}

.p-link {
  color: #13619a;
  cursor: pointer;
}

.p-link:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
  }
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

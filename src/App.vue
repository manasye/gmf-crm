<template>
  <div id="app">
    <div id="nav" v-if="$route.name !== 'login'">
      <navbar />
    </div>
    <router-view />
    <chat v-if="getRole() === 'Customer'" />

    <b-modal
      centered
      v-model="showModalAds"
      hide-footer
      hide-header
      body-class="modal-no-padding"
      v-if="popups.length > 0"
    >
      <slick ref="slick" :options="slickOptions">
        <div
          class="preview-popup"
          v-for="p in popups"
          :style="{
            backgroundImage: `url(${p.url})`
          }"
          :key="p.url"
        >
          <div class="preview-text-ads" v-if="p.type === 'birthday'">
            <h2>Happy Birthday</h2>
            <h4>Customer Name</h4>
            <p>Wishing you a wonderful birthday and a year filled with success</p>
          </div>
        </div>
      </slick>
    </b-modal>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Chat from "@/components/Chat.vue";
import axios from "axios";
import Slick from "vue-slick";

export default {
  name: "app",
  mounted() {
    axios
      .get("/login")
      .then(() => {
        if (!this.isAdmin() && this.$store.getters.firstTime) {
          axios
            .get(`/popup/read/${this.getUserId()}`)
            .then(res => {
              const data = res.data;
              let popups = [];
              if (data.popup_birthday) {
                popups.push({ url: this.getBaseStorage() + data.popup_birthday, type: "birthday" });
              }
              if (data.popup_holiday) {
                popups.push({ url: this.getBaseStorage() + data.popup_holiday, type: "holiday" });
              }
              if (data.popup_ads) {
                data.popup_ads.map(a => {
                  popups.push({ url: this.getBaseStorage() + a, type: "ads" });
                });
              }

              this.popups = popups;
              this.showModalAds = true;
              this.$store.commit("changeFirstTime", false);
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        if (!err.response.data.auth) {
          this.$store.dispatch("goToPage", "/login");
          localStorage.removeItem("role");
        }
      });
  },
  data() {
    return {
      popups: [],
      showModalAds: false,
      slickOptions: {
        slidesToShow: 1,
        infinite: false,
        arrows: true
      }
    };
  },
  components: {
    Navbar,
    Chat,
    Slick
  },
  computed: {
    activeRoute() {
      return this.$route.name || "";
    }
  },
  methods: {}
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

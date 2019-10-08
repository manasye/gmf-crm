import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";

import BootstrapVue from "bootstrap-vue";
import Chat from "vue-beautiful-chat";
import Header from "./components/Header";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTools,
  faInfoCircle,
  faUsers,
  faCommentDots,
  faTasks
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// require styles
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

library.add(faTools);
library.add(faInfoCircle);
library.add(faUsers);
library.add(faCommentDots);
library.add(faTasks);

Vue.use(BootstrapVue);
Vue.use(Chat);

Vue.component("Header", Header);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

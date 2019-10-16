import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VModal from 'vue-js-modal';

import BootstrapVue from 'bootstrap-vue';
import Chat from 'vue-beautiful-chat';
import Header from './components/Header';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTools,
  faInfoCircle,
  faUsers,
  faCommentDots,
  faTasks,
  faLink,
  faAngleDown,
  faAngleUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// require styles
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(faTools);
library.add(faInfoCircle);
library.add(faUsers);
library.add(faCommentDots);
library.add(faTasks);
library.add(faLink);
library.add(faAngleDown);
library.add(faAngleUp);

Vue.use(BootstrapVue);
Vue.use(Chat);
Vue.use(VModal);

Vue.component('Header', Header);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

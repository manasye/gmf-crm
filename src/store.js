import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    walkthrough: false
  },
  mutations: {
    changeWalkthrough(state, walkthrough) {
      state.walkthrough = walkthrough;
    }
  },
  getters: {
    walkthrough: state => state.walkthrough
  },
  actions: {
    goToPage(context, page) {
      return router.push(page);
    }
  }
});

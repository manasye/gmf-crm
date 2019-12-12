import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    walkthrough: false,
    firstTime: true
  },
  mutations: {
    changeWalkthrough(state, walkthrough) {
      state.walkthrough = walkthrough;
    },
    changeFirstTime(state, firstTime) {
      state.firstTime = firstTime;
    }
  },
  getters: {
    walkthrough: state => state.walkthrough,
    firstTime: state => state.firstTime
  },
  actions: {
    goToPage(context, page) {
      return router.push(page);
    }
  }
});

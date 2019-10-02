import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    // Customer Routes
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/project-customer",
      name: "project customer",
      component: () =>
        import(/* webpackChunkName: "project customer" */ "./views/Customer/Projects.vue")
    },
    {
      path: "/information-customer",
      name: "information customer",
      component: () =>
        import(/* webpackChunkName: "information customer" */ "./views/Customer/Information.vue")
    },
    {
      path: "/profile-customer",
      name: "profile customer",
      component: () =>
        import(/* webpackChunkName: "profile customer" */ "./views/Customer/Profile.vue")
    },
    {
      path: "/services-customer",
      name: "services customer",
      component: () =>
        import(/* webpackChunkName: "services customer" */ "./views/Customer/Service.vue")
    },
    {
      path: "/feedback-customer",
      name: "your feedback customer",
      component: () =>
        import(/* webpackChunkName: "feedback customer" */ "./views/Customer/Feedback.vue")
    },

    // Admin Routes
    {
      path: "/feedback-customer",
      name: "feedback customer",
      component: () =>
        import(/* webpackChunkName: "feedback customer" */ "./views/Customer/Feedback.vue")
    }
  ]
});

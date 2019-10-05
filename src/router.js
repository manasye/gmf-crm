import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/project-customer",
      name: "projectcustomer",
      component: () =>
        import(/* webpackChunkName: "projectcustomer" */ "./views/Customer/Projects.vue")
    },
    {
      path: "/project-customer/:id",
      name: "projectcustomerdetail",
      component: () =>
        import(/* webpackChunkName: "projectcustomerdeetail" */ "./views/Customer/ProjectDetail.vue")
    },
    {
      path: "/information-customer",
      name: "informationcustomer",
      component: () =>
        import(/* webpackChunkName: "informationcustomer" */ "./views/Customer/Information.vue")
    },
    {
      path: "/profile-customer",
      name: "profilecustomer",
      component: () =>
        import(/* webpackChunkName: "profilecustomer" */ "./views/Customer/Profile.vue")
    },
    {
      path: "/services-customer",
      name: "GMF Services customer",
      component: () =>
        import(/* webpackChunkName: "servicescustomer" */ "./views/Customer/Service.vue")
    },
    {
      path: "/feedback-customer",
      name: "your feedback customer",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomer" */ "./views/Customer/Feedback.vue")
    }

    // Admin Routes
    // {
    //   path: "/feedback-customer",
    //   name: "feedbackcustomer",
    //   component: () =>
    //     import(/* webpackChunkName: "feedback customer" */ "./views/Customer/Feedback.vue")
    // }
  ]
});

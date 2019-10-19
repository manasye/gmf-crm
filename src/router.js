import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/project-customer"
    },
    {
      path: "/login",
      name: "login",
      component: () => import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/project-customer",
      name: "project",
      component: () =>
        import(/* webpackChunkName: "projectcustomer" */ "./views/Customer/Projects.vue")
    },
    {
      path: "/project-customer/:id",
      name: "projectdetail",
      component: () =>
        import(/* webpackChunkName: "projectcustomerdetail" */
        "./views/Customer/ProjectDetail.vue")
    },
    {
      path: "/project-customer/:id/feedback",
      name: "projectfeedback",
      component: () =>
        import(/* webpackChunkName: "projectcustomerfeedback" */
        "./views/Customer/ProjectFeedback.vue")
    },
    {
      path: "/information-customer",
      name: "informationcustomer",
      component: () =>
        import(/* webpackChunkName: "informationcustomer" */
        "./views/Customer/Information.vue")
    },
    {
      path: "/information-customer/:id",
      name: "informationcustomerdetail",
      component: () =>
        import(/* webpackChunkName: "informationcustomerdetail" */
        "./views/Customer/InformationDetail.vue")
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
    },
    {
      path: "/feedback-customer-nonproject",
      name: "your feedback customer nonproj",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomernonproject" */ "./views/Customer/NonProjectFeedback.vue")
    },
    {
      path: "/feedback-customer-new",
      name: "your feedback customer new",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomernew" */
        "./views/Customer/FeedbackNew.vue")
    },
    {
      path: "/feedback-customer-new-nonproject",
      name: "your feedback customer new nonproj",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomernewnonproject" */
        "./views/Customer/NonProjectFeedbackNew.vue")
    },
    {
      path: "/feedback-customer/:id",
      name: "your feedback customer detail",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomerdetail" */
        "./views/Customer/FeedbackDetail.vue")
    },
    {
      path: "/feedback-customer-nonproject/:id",
      name: "your feedback customer detail nonproj",
      component: () =>
        import(/* webpackChunkName: "feedbackcustomerdetailnonproject" */
        "./views/Customer/NonProjectFeedbackDetail.vue")
    },

    // Admin Routes
    {
      path: "/customer",
      name: "customers admin",
      component: () =>
        import(/* webpackChunkName: "customers admin" */ "./views/Admin/Customer.vue")
    }
  ]
});

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
        import(/* webpackChunkName: "project-customer" */ "./views/Customer/Projects.vue")
    },
    {
      path: "/project-customer/:id",
      name: "projectdetail",
      component: () =>
        import(/* webpackChunkName: "project-customer-detail" */
        "./views/Customer/ProjectDetail.vue")
    },
    {
      path: "/project-customer/:id/feedback",
      name: "projectfeedback",
      component: () =>
        import(/* webpackChunkName: "project-customer-feedback" */
        "./views/Customer/ProjectFeedback.vue")
    },
    {
      path: "/information-customer",
      name: "informationcustomer",
      component: () =>
        import(/* webpackChunkName: "information-customer" */
        "./views/Customer/Information.vue")
    },
    {
      path: "/information-customer/:id",
      name: "informationcustomerdetail",
      component: () =>
        import(/* webpackChunkName: "information-custome-rdetail" */
        "./views/Customer/InformationDetail.vue")
    },
    {
      path: "/profile-customer",
      name: "profilecustomer",
      component: () =>
        import(/* webpackChunkName: "profile-customer" */ "./views/Customer/Profile.vue")
    },
    {
      path: "/services-customer",
      name: "GMF Services customer",
      component: () =>
        import(/* webpackChunkName: "services-customer" */ "./views/Customer/Service.vue")
    },
    {
      path: "/feedback-customer",
      name: "your feedback",
      component: () =>
        import(/* webpackChunkName: "feedback-customer" */ "./views/Customer/Feedback.vue")
    },
    {
      path: "/feedback-customer-nonproject",
      name: "your feedback customer nonproj",
      component: () =>
        import(/* webpackChunkName: "feedback-customer-non-project" */ "./views/Customer/NonProjectFeedback.vue")
    },
    {
      path: "/feedback-customer-new",
      name: "your feedback customer new",
      component: () =>
        import(/* webpackChunkName: "feedback-customer-new" */
        "./views/Customer/FeedbackNew.vue")
    },
    {
      path: "/feedback-customer-new-nonproject",
      name: "your feedback customer new nonproj",
      component: () =>
        import(/* webpackChunkName: "feedback-customer-new-non-project" */
        "./views/Customer/NonProjectFeedbackNew.vue")
    },
    {
      path: "/feedback-customer/:id",
      name: "your feedback customer detail",
      component: () =>
        import(/* webpackChunkName: "feedback-customer-detail" */
        "./views/Customer/FeedbackDetail.vue")
    },
    {
      path: "/feedback-customer-nonproject/:id",
      name: "your feedback customer detail nonproj",
      component: () =>
        import(/* webpackChunkName: "feedback-customer-detail-non-project" */
        "./views/Customer/NonProjectFeedbackDetail.vue")
    },

    // Admin Routes
    {
      path: "/customer",
      name: "customers admin",
      component: () =>
        import(/* webpackChunkName: "customers-admin" */ "./views/Admin/Customer.vue")
    },
    {
      path: "/customer/:id/:type",
      name: "customers admin detail",
      component: () =>
        import(/* webpackChunkName: "customers-admin-detail" */ "./views/Admin/CustomerDetail.vue")
    },
    {
      path: "/project",
      name: "project",
      component: () => import(/* webpackChunkName: "project-admin" */ "./views/Admin/Projects.vue")
    },
    {
      path: "/messages",
      name: "messages",
      component: () => import(/* webpackChunkName: "message" */ "./views/Admin/Message.vue")
    }
  ]
});

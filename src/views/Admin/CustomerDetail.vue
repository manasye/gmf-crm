<template>
  <b-container fluid class="container-app">
    <Header :title="$route.params.id" :breadcrumbs="breadcrumbs"></Header>
    <b-tabs content-class="mt-3">
      <b-tab
        :title="tab.title"
        :active="tab.route === tabActive"
        v-for="tab in tabs"
        :key="tab.title"
        @click="$store.dispatch('goToPage', `/customer/${$route.params.id}/${tab.route}`)"
        ><component :is="tab.component" :company="$route.params.id"></component
      ></b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import Overview from "@/components/CustomerDetail/Overview";
import Ads from "@/components/CustomerDetail/Ads";
import Complaint from "@/components/CustomerDetail/Complaint";
import Feedback from "@/components/CustomerDetail/Feedback";
import Fleet from "@/components/CustomerDetail/Fleet";
import Revenue from "@/components/CustomerDetail/Revenue";

export default {
  mounted() {
    this.tabActive = this.$route.params.type;
    console.log(convertSnakeCaseToText("company_name"));
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Customer List",
          href: "/#/customer"
        },
        {
          text: `${this.$route.params.id}`,
          active: true
        }
      ],
      tabs: [
        { title: "Overview", route: "Overview", component: Overview },
        { title: "Fleet & Maint Provider", route: "Fleet", component: Fleet },
        { title: "Revenue & Activities", route: "Revenue", component: Revenue },
        { title: "Complaint", route: "Complaint", component: Complaint },
        { title: "Feedback", route: "Feedback", component: Feedback },
        { title: "Ads", route: "Ads", component: Ads }
      ],
      tabActive: "Overview"
    };
  },
  components: {
    Overview
  }
};
</script>

<style scoped></style>

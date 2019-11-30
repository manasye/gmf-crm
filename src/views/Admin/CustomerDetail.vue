<template>
  <b-container fluid class="container-app">
    <Header :title="companyName" :breadcrumbs="breadcrumbs"></Header>
    <b-tabs content-class="mt-3">
      <b-tab
        :title="tab.title"
        :active="tab.route === tabActive"
        v-for="tab in tabs"
        :key="tab.title"
        @click="$store.dispatch('goToPage', `/customer/${$route.params.id}/${tab.route}`)"
        :lazy="true"
        ><component :is="tab.component" :id="$route.params.id"></component
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
import axios from "axios";

export default {
  mounted() {
    this.tabActive = this.$route.params.type;
    if (!this.$store.getters.walkthrough) {
      axios
        .get(`/company/edit/${this.$route.params.id}`)
        .then(({ data }) => {
          this.companyName = data.data[0].name;
          this.breadcrumbs = [
            {
              text: "Customer List",
              href: "/#/customer"
            },
            {
              text: data.data[0].name,
              active: true
            }
          ];
        })
        .catch(() => {});
    }
  },
  data() {
    return {
      breadcrumbs: [],
      tabs: [
        { title: "Overview", route: "Overview", component: Overview },
        { title: "Fleet & Maint Provider", route: "Fleet", component: Fleet },
        { title: "Revenue & Activities", route: "Revenue", component: Revenue },
        { title: "Complaint", route: "Complaint", component: Complaint },
        { title: "Feedback", route: "Feedback", component: Feedback },
        { title: "Ads", route: "Ads", component: Ads }
      ],
      tabActive: "Overview",
      companyName: ""
    };
  },
  components: {
    Overview
  }
};
</script>

<style scoped></style>

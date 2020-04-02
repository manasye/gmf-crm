<template>
  <b-container fluid class="container-app">
    <Header
      title="PROFILE"
      subtitle="List of user accounts from your company"
    ></Header>
    <div class="profile-wrapper mt-md-4">
      <b-row>
        <b-col cols="12" md="4" class="mt-4 mt-md-0">
          <img :src="getBaseStorage() + companyImg" alt class="mb-4 d-block mx-auto" />
          <h4 class="profile-title">{{ companyName }}</h4>
        </b-col>

        <b-col cols="12" md="4" class="mt-4 mt-md-0">
          <h5
            data-intro="You can view your Colleague Account Registerd Account in this Application"
          >
            CUSTOMER ACCOUNT
          </h5>
          <hr align="left" />
          <div v-for="c in customers" :key="c.user_customer_id" class="mb-3">
            <b-row>
              <b-col cols="2">
                <img :src="getBaseStorage() + c.image" alt="" />
              </b-col>
              <b-col cols="10">
                <p>{{ c.name }}</p>
                <p class="username">{{ c.username }}</p></b-col
              >
            </b-row>
          </div>
        </b-col>

        <b-col cols="12" md="4" class="mt-4 mt-md-0">
          <h5 data-intro="You can view GMF Contact person">GMF CONTACT PERSON</h5>
          <hr style="width:10%" align="left" />
          <div v-for="c in contactPersons" :key="c.gmf_cp_id" class="mb-3">
            <b-row>
              <b-col cols="2"> <img :src="getBaseStorage() + c.image" alt=""/></b-col>
              <b-col cols="9">
                <p>{{ c.name }}</p>
                <p class="username">{{ c.position }} &nbsp;&nbsp;{{ c.phone }}</p>
                <p class="username">{{ c.email }}</p></b-col
              >
            </b-row>
          </div>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    axios
      .get(`/company/edit/${this.getCompanyId()}`)
      .then(res => {
        this.companyName = res.data.data[0].name;
        this.companyImg = res.data.data[0].image;
      })
      .catch(() => {});
    axios
      .get(`/company/read/${this.getCompanyId()}`)
      .then(res => {
        this.customers = res.data.data;
      })
      .catch(() => {});
    axios
      .get(`/cp/read/${this.getCompanyId()}`)
      .then(res => {
        this.contactPersons = res.data.data;
      })
      .catch(() => {});

    if (this.$store.getters.walkthrough) {
      this.completed = false;
      const introJS = require("intro.js");
      introJS
        .introJs()
        .setOption("doneLabel", "Next page")
        .start()
        .onexit(() => {
          if (!this.completed) this.$store.commit("changeWalkthrough", false);
        })
        .oncomplete(() => {
          this.completed = true;
          window.location.href = "/#/services";
          this.$store.commit("changeWalkthrough", true);
        });
    }
  },
  data() {
    return {
      customers: [],
      contactPersons: [],
      companyName: "",
      companyImg: "",
      completed: false
    };
  }
};
</script>

<style scoped>
.profile-wrapper {
  border: 1px solid #949699;
  padding: 30px;
}
.profile-title {
  color: #002752;
  text-align: center;
  font-weight: bold;
}
h5 {
  color: #13619a;
  font-weight: bold;
}
hr {
  border-top: 4px solid #13619a;
  margin-top: 0.5rem;
  width: 10%;
}
p {
  margin-bottom: 0;
}
p.username {
  color: #949699;
}
@media (max-width: 700px) {
  .profile-wrapper {
    padding: 10px;
  }
}
</style>

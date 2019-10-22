<template>
  <div>
    <b-navbar toggleable="md" type="dark" class="navbar">
      <b-navbar-brand href="/#/project-customer">
        <img src="../assets/img/logo-white.png" alt class="logo-img" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <div v-for="nav in navItems" :key="nav.name">
            <b-nav-item
              v-if="!nav.childrens"
              :href="nav.route"
              class="navbar-item"
              :class="{
                'navbar-item-active': activeRoutes.toLowerCase().includes(nav.name.toLowerCase())
              }"
            >
              <font-awesome-icon :icon="nav.icon" />
              {{ nav.name }}
            </b-nav-item>

            <b-nav-item-dropdown
              v-else
              :class="{
                'navbar-dropdown-item-active': activeRoutes
                  .toLowerCase()
                  .includes(nav.name.toLowerCase())
              }"
            >
              <template v-slot:button-content>
                <font-awesome-icon :icon="nav.icon" />
                {{ nav.name }}
              </template>
              <b-dropdown-item
                v-for="children in nav.childrens"
                :href="children.route"
                :key="children.name"
                >{{ children.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </div>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto nav-search">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          </b-nav-form>

          <b-nav-item>
            <img src="../assets/img/help.png" class="navbar-img" alt @click="startWalkthrough" />
          </b-nav-item>

          <b-nav-item-dropdown right class="user-navbar">
            <template v-slot:button-content>
              <img
                src="https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png"
                alt
                class="navbar-img"
              />
            </template>
            <div style="margin: 15px 15px 0 15px">
              <img
                src="https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png"
                alt
                class="navbar-img-expand mb-3"
              />
              <p class="mb-2 text-center">John Henderson</p>
              <b-button variant="primary" size="sm" class="d-block mx-auto">LOG OUT</b-button>
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // navItems: [
      //   { name: "Project", route: "/#/project-customer", icon: "tasks" },
      //   {
      //     name: "Information",
      //     route: "/#/information-customer",
      //     icon: "info-circle"
      //   },
      //   { name: "Profile", route: "/#/profile-customer", icon: "users" },
      //   { name: "GMF Services", route: "/#/services-customer", icon: "tools" },
      //   {
      //     name: "Your Feedback",
      //     route: "/#/feedback-customer",
      //     icon: "comment-dots",
      //     childrens: [
      //       {
      //         name: "Complaint",
      //         route: "/#/feedback-customer"
      //       },
      //       {
      //         name: "Non-project Feedback",
      //         route: "/#/feedback-customer-nonproject"
      //       }
      //     ]
      //   }
      // ]
      navItems: [
        { name: "Customer", route: "/#/customer", icon: "users" },
        { name: "Project", route: "/#/project-customer", icon: "tasks" },
        { name: "Message", route: "/#/messages", icon: "comment-dots" },
        {
          name: "Complaint",
          route: "/#/complaint",
          icon: "comment-slash",
          childrens: [
            { name: "Complaint List", route: "/#/complaint-list" },
            { name: "Complaint Trend", route: "/#/complaint-trend" }
          ]
        },
        {
          name: "Feedback",
          route: "/#/feedback",
          icon: "retweet",
          childrens: [
            { name: "Feedback List", route: "/#/feedback-list" },
            { name: "Feedback Trend", route: "/#/feedback-trend" }
          ]
        },
        {
          name: "Info",
          route: "/#/information-customer",
          icon: "info-circle"
        },
        { name: "Services", route: "/#/services-customer", icon: "tools" }
      ]
    };
  },
  methods: {
    startWalkthrough() {
      this.$store.commit("changeWalkthrough", true);
    }
  },
  computed: {
    activeRoutes() {
      return this.$route.name || "";
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: #022f46;
}
.logo-img {
  height: 40px;
}
.navbar-item a {
  color: rgba(255, 255, 255, 0.6) !important;
}
.navbar-item:hover a {
  color: white !important;
}
.navbar-item-active,
.navbar-item-active a {
  color: white !important;
}
.navbar-img {
  height: 25px;
  margin-right: 5px;
}
.navbar-img-expand {
  height: 40px;
  margin: 0 auto;
  display: block;
}
.user-navbar {
  margin-right: 10px;
}
</style>

<style>
.b-nav-dropdown a {
  color: rgba(255, 255, 255, 0.6) !important;
}
.b-nav-dropdown ul li a {
  color: black !important;
}
.navbar-dropdown-item-active a {
  color: white !important;
}
@media (max-width: 1024px) and (min-width: 701px) {
  .nav-item {
    font-size: 10px;
  }
}
@media (max-width: 700px) {
  .navbar-nav .dropdown-menu {
    width: 70vw;
  }
  .nav-search input {
    margin: 7px 0;
  }
}
</style>

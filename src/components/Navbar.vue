<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="navbar">
      <b-navbar-brand href="/#/project-customer"
        ><img src="../assets/img/logo-white.png" alt="" class="nav-img"
      /></b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            v-for="nav in navItems"
            :href="nav.route"
            :key="nav.name"
            class="navbar-item"
            :class="{
              'navbar-item-active': activeRoutes.toLowerCase().includes(nav.name.toLowerCase())
            }"
            >{{ nav.name }}</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <img
                src="https://ra.ac.ae/wp-content/uploads/2017/02/user-icon-placeholder.png"
                alt=""
                class="user-img"
              />
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
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
      navItems: [
        { name: "Project", route: "/#/project-customer" },
        { name: "Information", route: "/#/information-customer" },
        { name: "Profile", route: "/#/profile-customer" },
        { name: "GMF Services", route: "/#/services-customer" },
        { name: "Your Feedback", route: "/#/feedback-customer" }
      ]
      // activeRoutes: this.$router.
    };
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
.nav-img {
  height: 40px;
}
.navbar-item a {
  color: rgba(255, 255, 255, 0.6) !important;
}
.navbar-item:hover a {
  color: white !important;
}
.navbar-item-active a {
  color: white !important;
}
.user-img {
  height: 25px;
  margin-right: 5px;
}
</style>

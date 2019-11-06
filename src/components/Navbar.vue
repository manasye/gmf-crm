<template>
  <div>
    <b-navbar toggleable="md" type="dark" class="navbar" fixed="top">
      <b-navbar-brand :href="this.role === 'Customer' ? '/#/project-customer' : '/#/customer'">
        <img src="../assets/img/logo-white.png" alt class="logo-img" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <div v-for="nav in navItems" :key="nav.name" :data-intro="nav.intro">
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

          <b-nav-item v-if="this.role === 'Customer'">
            <img
              src="../assets/img/help.png"
              class="navbar-img"
              alt
              @click="showModal = !showModal"
            />
          </b-nav-item>

          <b-nav-item-dropdown v-else right>
            <template v-slot:button-content>
              <img src="../assets/img/calendar.png" class="navbar-img" alt
            /></template>
            <div>
              <datepicker :inline="true" v-model="selectedDate" :highlighted="highlighted" />
              <div class="p-2">
                <p class="mb-0">{{ selectedDate | moment("DD MMMM YYYY") }}</p>
              </div>
            </div>
          </b-nav-item-dropdown>

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
              <p class="mb-2 text-center">{{ username }}</p>
              <b-button variant="primary" size="sm" class="d-block mx-auto mb-3" @click="logout"
                >LOG OUT</b-button
              >
            </div>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-modal v-model="showModal" centered title="Explore CRM Digital Marketing"
      >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad amet consequatur debitis dolorem
      eaque illo impedit iure mollitia numquam quis rem sed similique suscipit totam, voluptatibus.
      Blanditiis ipsum libero tenetur.

      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <b-button size="sm" variant="secondary" @click="showModal = false">
          Skip
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          @click="
            () => {
              startWalkthrough();
              showModal = false;
            }
          "
        >
          Explore
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import axios from "axios";

export default {
  mounted() {
    if (!this.role) {
      window.location.href = "/#/login";
    } else {
      if (this.role === "Customer") {
        this.navItems = [
          {
            name: "Project",
            route: "/#/project-customer",
            icon: "tasks",
            intro: "PROJECTS <br/> akoakosakoas"
          },
          {
            name: "Information",
            route: "/#/information-customer",
            icon: "info-circle",
            intro: "lorem"
          },
          { name: "Profile", route: "/#/profile-customer", icon: "users", intro: "lorem" },
          { name: "GMF Services", route: "/#/services", icon: "tools", intro: "lorem" },
          {
            name: "Your Feedback",
            route: "/#/feedback-customer",
            icon: "comment-dots",
            intro: "lorem",
            childrens: [
              {
                name: "Complaint",
                route: "/#/feedback-customer"
              },
              {
                name: "Non-project Feedback",
                route: "/#/feedback-customer-nonproject"
              }
            ]
          }
        ];
      } else if (this.role === "Admin" || this.role === "Guest") {
        this.navItems = [
          { name: "Customer", route: "/#/customer", icon: "users" },
          { name: "Project", route: "/#/project", icon: "tasks" },
          { name: "Message", route: "/#/messages", icon: "comment-dots" },
          {
            name: "Complaint",
            route: "/#/complaint-list",
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
            route: "/#/information-newsletter",
            icon: "info-circle",
            childrens: [
              { name: "Newsletter", route: "/#/information-newsletter" },
              { name: "Holiday Card", route: "/#/information-holiday-card" },
              { name: "Birthday Card", route: "/#/information-birthday-card" }
            ]
          },
          { name: "Services", route: "/#/services", icon: "tools" }
        ];
      } else {
        this.$store.dispatch("goToPage", "/#/login");
      }
    }
  },
  data() {
    return {
      showModal: false,
      navItems: null,
      selectedDate: null,
      highlighted: {
        customPredictor: function(date) {
          // highlights every day of a month which is a multiple of 4
          if (date.getDate() % 4 === 0) {
            return true;
          }
        }
      }
    };
  },
  methods: {
    startWalkthrough() {
      this.$store.commit("changeWalkthrough", true);
      const introJS = require("intro.js");
      introJS
        .introJs()
        .setOption("doneLabel", "Next page")
        .start()
        .oncomplete(function() {
          window.location.href = "/#/project-customer/a";
        });
    },
    logout() {
      axios
        .get("/logout")
        .then(() => {
          localStorage.removeItem("role");
          this.$store.dispatch("goToPage", "/login");
        })
        .catch(() => {});
    }
  },
  computed: {
    activeRoutes() {
      return this.$route.name || "";
    },
    role() {
      return localStorage.getItem("role");
    },
    username() {
      return localStorage.getItem("username");
    }
  },
  components: { Datepicker }
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
.dropdown-menu {
  padding: 0 !important;
}
</style>

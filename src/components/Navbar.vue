<template>
  <div>
    <b-navbar toggleable="md" type="dark" class="navbar" fixed="top">
      <b-navbar-brand :href="getRole() === 'Customer' ? '/#/project-customer' : '/#/customer'">
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

          <b-nav-item v-if="getRole() === 'Customer'">
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
              <datepicker
                :inline="true"
                @selected="changeSelectedDate"
                :highlighted="highlighted"
                @changedMonth="changeMonth"
                @changedYear="changeMonth"
                @changedDecade="changeMonth"
                :minimumView="'day'"
                :maximumView="'day'"
              />
              <div class="p-2 info-event" v-if="selectedDate" style="">
                <p class="mb-0">
                  {{ selectedDate }}
                </p>
                <hr style="margin: 8px 0" />
                <div v-for="e in eventSelected" :key="e.event">
                  <p class="mb-2">
                    {{ e.event }}
                    <span v-if="e.company" style="color: #949699">{{ e.company }} </span>
                  </p>
                </div>
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
              <p class="mb-2 text-center">{{ getUsername() }}</p>
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
import moment from "moment";

export default {
  mounted() {
    if (this.getRole() === "Customer") {
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
    } else if (this.getRole() === "Admin" || this.getRole() === "Guest") {
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
    }

    const now = new Date();

    axios
      .get(`/calendar/${now.getMonth() + 1}/${now.getFullYear()}`)
      .then(res => {
        this.highlighted = {
          ...this.highlighted,
          daysOfMonth: res.data.highlightedDays
        };
      })
      .catch(() => {});
  },
  data() {
    return {
      showModal: false,
      navItems: null,
      selectedDate: null,
      highlighted: {
        daysOfMonth: [1, 2, 3]
      },
      month: null,
      eventSelected: []
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
    },
    changeMonth(date) {
      axios
        .get(`/calendar/${date.getMonth() + 1}/${date.getFullYear()}`)
        .then(res => {
          this.highlighted = {
            ...this.highlighted,
            daysOfMonth: res.data.highlightedDays
          };
        })
        .catch(() => {});
    },
    changeSelectedDate(date) {
      this.selectedDate = moment(date).format("DD MMMM YYYY");
      axios
        .get(`/calendar/${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
        .then(res => {
          this.eventSelected = res.data.detail;
        })
        .catch(() => {});
    },
    moment: function() {
      return moment();
    }
  },
  computed: {
    activeRoutes() {
      return this.$route.name || "";
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
.info-event {
  overflow-y: auto;
  height: 250px;
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

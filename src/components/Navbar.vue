<template>
  <div>
    <b-navbar toggleable="md" type="dark" class="navbar" fixed="top">
      <b-navbar-brand :href="getRole() === 'Customer' ? '/#/project-customer' : '/#/customer'">
        <img src="../assets/img/logo-white.png" alt class="logo-img" />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse" />

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

              <font-awesome-icon icon="circle" v-if="nav.notif" size="xs" class="blinker-notif" />
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
                <font-awesome-icon icon="circle" v-if="nav.notif" size="xs" class="blinker-notif" />
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

        <b-navbar-nav class="ml-auto">
          <b-nav-form @submit.prevent="searchPage">
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="Search"
              v-model="searchQuery"
            />
          </b-nav-form>

          <b-nav-item v-if="getRole() === 'Customer'">
            <img
              src="../assets/img/help.png"
              class="navbar-img"
              alt
              @click="showModal = !showModal"
            />
          </b-nav-item>

          <b-nav-item-dropdown v-else right class="no-icon-dropdown">
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
                  <p class="mb-2" style="color: #13619a">
                    {{ e.event }}
                    <span v-if="e.company" style="color: #949699">{{ e.company }} </span>
                  </p>
                </div>
              </div>
            </div>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown ref="userdropdown" right class="user-navbar" id="icon-user">
            <template v-slot:button-content>
              <img
                :src="
                  getUserImage()
                    ? getBaseStorage() + getUserImage()
                    : require('../assets/img/default_profile.png')
                "
                alt
                class="navbar-img"
              />
            </template>
            <div style="margin: 15px 15px 0 15px">
              <div style="text-align: right">
                <font-awesome-icon
                  icon="pen"
                  style="cursor: pointer; margin-bottom: 16px"
                  @click="showImgModal = true"
                />
              </div>
              <img
                :src="
                  getUserImage()
                    ? getBaseStorage() + getUserImage()
                    : require('../assets/img/default_profile.png')
                "
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

    <b-modal v-model="showImgModal" centered title="Change User Image" @ok="changeImage">
      <b-row>
        <b-col cols="4"> <label class="mt-2">User Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file v-model="userImage" placeholder="Choose new image" accept="image/*" />
        </b-col> </b-row
    ></b-modal>

    <b-modal
      centered
      v-model="showModalAds"
      hide-footer
      hide-header
      body-class="modal-no-padding"
      v-if="popups.length > 0"
    >
      <slick ref="slick" :options="slickOptions">
        <div
          class="preview-popup"
          v-for="p in popups"
          :style="{
            backgroundImage: `url(${p.url})`
          }"
          :key="p.url"
          @click="explore(p.permalink)"
        >
          <div class="preview-text-ads" v-if="p.type === 'birthday'">
            <h2>Happy Birthday</h2>
            <h4>{{ getUsername() }}</h4>
            <p>Wishing you a wonderful birthday and a year filled with success</p>
          </div>
        </div>
      </slick>
    </b-modal>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import axios from "axios";
import moment from "moment";
import swal from "sweetalert";
import Slick from "vue-slick";
import { isAdmin } from "../utility/func";

export default {
  mounted() {
    axios
      .get("/login")
      .then(() => {
        if (!this.isAdmin() && this.$store.getters.firstTime) {
          axios
            .get(`/popup/read/${this.getUserId()}`)
            .then(res => {
              const data = res.data;
              let popups = [];
              if (data.popup_birthday) {
                data.popup_birthday.map(a => {
                  popups.push({
                    url: this.getBaseStorage() + a.image,
                    type: "birthday",
                    permalink: a.permalink,
                    interval: a.interval
                  });
                });
              }
              if (data.popup_holiday) {
                data.popup_holiday.map(a => {
                  popups.push({
                    url: this.getBaseStorage() + a.image,
                    type: "holiday",
                    permalink: a.permalink,
                    interval: a.interval
                  });
                });
              }
              if (data.popup_ads) {
                data.popup_ads.map(a => {
                  popups.push({
                    url: this.getBaseStorage() + a.image,
                    type: "ads",
                    permalink: a.permalink,
                    interval: a.interval
                  });
                });
              }

              popups.map((p, idx) => {
                const key = "_timeInMs_" + (idx + 1);
                const timeInMs = localStorage.getItem(key);
                if (!timeInMs) {
                  if (idx === 0) {
                    this.popups = [p];
                    this.showModalAds = true;
                  }
                  this.setupInterval(
                    () => {
                      if (!this.showModalAds) {
                        this.popups = [p];
                        this.showModalAds = true;
                      }
                    },
                    p.interval * 60 * 1000,
                    idx + 1
                  );
                }
              });

              this.popups = popups;
            })
            .catch(() => {});
        }
      })
      .catch(err => {
        if (!err.response.data.auth) {
          this.$store.dispatch("goToPage", "/login");
          localStorage.removeItem("role");
        }
      });

    setTimeout(
      () =>
        document.getElementsByClassName("navbar-item")[1].addEventListener("click", () => {
          this.navItems[1].notif = false;
        }),
      1000
    );

    this.$refs.userdropdown.$emit("show");

    if (this.getRole() === "Customer") {
      this.navItems = [
        {
          name: "Project",
          route: "/#/project-customer",
          icon: "tasks"
        },
        {
          name: "Information",
          route: "/#/information-customer",
          icon: "info-circle",
          notif: false
        },
        { name: "Profile", route: "/#/profile-customer", icon: "users" },
        { name: "GMF Services", route: "/#/services", icon: "tools" },
        {
          name: "Your Feedback",
          route: "/#/feedback-customer",
          icon: "comment-dots",
          childrens: [
            {
              name: "Complaint",
              route: "/#/feedback-customer"
            },
            {
              name: "Non-project Feedback",
              route: "/#/feedback-nonproject"
            }
          ]
        }
      ];
    } else if (this.getRole() === "Admin" || this.getRole() === "Guest") {
      this.navItems = [
        { name: "Customer", route: "/#/customer", icon: "users" },
        { name: "Project", route: "/#/project", icon: "tasks" },
        {
          name: "Message",
          route: "/#/messages",
          icon: "comment-dots",
          notif: false,
          childrens: [
            { name: "Message", route: "/#/messages" },
            { name: "Message History", route: "/#/messages-history" }
          ]
        },
        {
          name: "Complaint",
          route: "/#/complaint-list",
          icon: "comment-slash",
          notif: true,
          childrens: [
            { name: "Complaint List", route: "/#/complaint-list" },
            { name: "Complaint Trend", route: "/#/complaint-trend" }
          ]
        },
        {
          name: "Feedback",
          route: "/#/feedback",
          icon: "retweet",
          notif: false,
          childrens: [
            { name: "Feedback List", route: "/#/feedback-list" },
            { name: "Feedback Trend", route: "/#/feedback-trend" },
            { name: "Non Project Feedback", route: "/#/feedback-nonproject" }
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

    if (!isAdmin()) {
      this.getNotif();
      this.notifInterval = setInterval(() => {
        this.getNotif();
      }, 15000);
    } else {
      this.getAdminNotif();
      this.notifInterval = setInterval(() => {
        this.getAdminNotif();
      }, 5000);
    }

    this.idleTimer();
  },
  beforeDestroy() {
    clearInterval(this.notifInterval);
  },
  data() {
    return {
      searchQuery: null,
      showModal: false,
      showImgModal: false,
      navItems: null,
      selectedDate: null,
      highlighted: {
        daysOfMonth: []
      },
      month: null,
      eventSelected: [],
      completed: false,
      firstTime: true,
      userImage: null,
      notifInterval: null,
      popups: [],
      showModalAds: false,
      slickOptions: {
        slidesToShow: 1,
        infinite: false,
        arrows: true
      },
      timeOutLogout: null
    };
  },
  methods: {
    explore(link) {
      if (link) window.location = link;
    },
    startWalkthrough() {
      this.$store.commit("changeWalkthrough", true);
      window.location.href = "/#/project-customer";
      this.completed = false;

      setTimeout(() => {
        const introJS = require("intro.js");
        introJS
          .introJs()
          .setOption("doneLabel", "Next page")
          .start()
          .onexit(() => {
            if (!this.completed) this.$store.commit("changeWalkthrough", false);
          })
          .oncomplete(() => {
            this.firstTime = false;
            this.completed = true;
            window.location.href = "/#/project-customer/a/feedback";
            this.$store.commit("changeWalkthrough", true);
          });
      }, 1000);
    },
    logout() {
      axios
        .get("/logout")
        .then(() => {
          localStorage.removeItem("role");
          this.$store.dispatch("goToPage", "/login");
          this.popups.map((p, idx) => {
            localStorage.removeItem("_timeInMs_" + (idx + 1));
          });
        })
        .catch(() => {});
    },
    changeMonth(date) {
      this.highlighted = {
        daysOfMonth: []
      };
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
    },
    changeImage() {
      if (this.userImage.size > 500000) {
        swal("Error", `File size exceeded 500KB`, "error");
        return;
      }
      let form = new FormData();
      form.append("id", this.getUserId());
      form.append("image", this.userImage);
      axios
        .post("/user/update", form)
        .then(res => {
          localStorage.setItem("user_image", res.data.data.image);
          swal("Success", "Image updated", "success").then(() => {
            window.location.reload();
          });
        })
        .catch(() => {});
    },
    getNotif() {
      axios
        .get(`/customer/edit/${localStorage.getItem("user_customer_id")}`)
        .then(res => {
          const newInfo = res.data.data[0].new_info;
          if (newInfo > 0) {
            this.navItems[1].notif = true;
          }
        })
        .catch(() => {});
    },
    getAdminNotif() {
      axios
        .get(`/admin/read/${this.getUserId()}`)
        .then(res => {
          const data = res.data.data[0];
          this.navItems[2].notif = data.not_read_msg > 0;
          this.navItems[3].notif = data.not_read_complaint > 0;
          this.navItems[4].notif = data.not_read_feedback > 0;
        })
        .catch(() => {});
    },
    searchPage() {
      if (this.searchQuery) this.$store.dispatch("goToPage", `/search/${this.searchQuery}`);
    },
    setupInterval(callback, interval, name) {
      const key = "_timeInMs_" + (name || "");
      const now = Date.now();
      const timeInMs = localStorage.getItem(key);
      const executeCallback = function() {
        localStorage.setItem(key, Date.now());
        callback();
      };
      if (timeInMs) {
        const time = parseInt(timeInMs);
        const delta = now - time;
        if (delta > interval) {
          setInterval(executeCallback, interval);
        } else {
          setTimeout(function() {
            setInterval(executeCallback, interval);
            executeCallback();
          }, interval - delta);
        }
      } else {
        setInterval(executeCallback, interval);
      }
      localStorage.setItem(key, now);
    },
    idleTimer() {
      const self = this;
      window.onload = resetTimer;
      window.onmousemove = resetTimer;
      window.onmousedown = resetTimer;
      window.onclick = resetTimer;
      window.onscroll = resetTimer;
      window.onkeypress = resetTimer;
      function resetTimer() {
        clearTimeout(this.timeOutLogout);
        this.timeOutLogout = setTimeout(() => {
          if (self.getRole()) swal("Timeout", "You have been inactive for 15 minutes", "error");
          self.logout();
        }, 15 * 60 * 1000);
      }
    }
  },
  computed: {
    activeRoutes() {
      return this.$route.name || "";
    }
  },
  components: { Datepicker, Slick }
};
</script>

<style scoped lang="scss">
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
  max-width: 30px;
}
.navbar-img-expand {
  height: auto;
  margin: 0 auto;
  display: block;
  max-width: 100%;
}
.user-navbar {
  margin-right: 10px;
}
.info-event {
  overflow-y: auto;
  height: 250px;
}
.blinker-notif {
  max-width: 7px;
}
</style>

<style>
.no-icon-dropdown a::after {
  display: none !important;
}
.navbar-brand {
  margin-right: 0 !important;
}
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

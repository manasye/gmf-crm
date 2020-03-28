<template>
  <b-container fluid class="container-app" data-intro="Infor">
    <Header title="INFORMATION LIST" />

    <b-row>
      <b-col cols="6" md="2" class="mt-2">
        <p>Items per page</p>
      </b-col>
      <b-col cols="6" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions" />
      </b-col>
    </b-row>

    <div class="table-responsive" style="margin-top: 20px">
      <table class="table table-striped">
        <thead>
          <tr>
            <th v-for="field in informationFields" :key="field">{{ field }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info, idx) in paginatedItems">
            <tr data-toggle="collapse" class="clickable" @click="showInfoDetail(idx)" :key="idx">
              <!--              <td width="5%">-->
              <!--                <div style="text-align: right">-->
              <!--                  <span class="dot" v-if="info.new"></span>-->
              <!--                </div>-->
              <!--              </td>-->
              <td width="15%">{{ info.category }}</td>
              <td>{{ info.subject }}</td>
              <td>{{ info.updated_at | moment }}</td>
              <td width="5%">
                <font-awesome-icon :icon="info.plus ? 'angle-down' : 'angle-up'" />
              </td>
            </tr>
            <tr v-if="!info.plus" :key="idx">
              <td colspan="12">
                <div class="detail-info-image">
                  <img
                    :src="getBaseStorage() + info.image"
                    alt
                    v-if="info.category !== 'Birthday Card'"
                    @click="explore(info.permalink)"
                  />
                  <div
                    :style="{
                      backgroundImage: `url(${getBaseStorage() + info.image})`
                    }"
                    class="info-birthday"
                    v-else
                    @click="explore(info.permalink)"
                  >
                    <div class="info-birthday-text">
                      <h2>Happy Birthday</h2>
                      <h4>{{ getUsername() }}</h4>
                      <p style="word-break: break-all; white-space: normal;">
                        Wishing you a wonderful birthday and a year filled with success
                      </p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage" align="right" />
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";
import axios from "axios";
import moment from "moment";

const initialInfo = {
  subject: "Islam",
  updated_at: "2019-11-13 06:35:45",
  image: "religioncard/19OrE946ST73UqcKodV2LZaZpw0XbBalvHVyeVzN.jpeg",
  category: "Holiday Card",
  plus: true
};

export default {
  mounted() {
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
    } else {
      axios
        .get(`/information/read/${this.getUserId()}`)
        .then(res => {
          this.infos = res.data.map(el => {
            let o = Object.assign({}, el);
            o.plus = true;
            return o;
          });
        })
        .catch(() => {});
    }

    axios
      .get(`/information/readinformation/${localStorage.getItem("user_customer_id")}`)
      .then(() => {})
      .catch(() => {});
  },
  data() {
    return {
      model: true,
      perPage: "10",
      perPageOptions,
      currentPage: 1,
      informationFields: ["Category", "Subject", "Date", ""],
      infos: Array(3).fill(initialInfo),
      completed: false
    };
  },
  methods: {
    showInfoDetail(idx) {
      const paginatedIdx = (this.currentPage - 1) * +this.perPage + idx;
      this.infos[paginatedIdx].plus = !this.infos[paginatedIdx].plus;
    },
    moment: function() {
      return moment();
    },
    paginate(array, page_size, page_number) {
      --page_number;
      return array.slice(page_number * page_size, (page_number + 1) * page_size);
    },
    explore(link) {
      if (link) window.location = link;
    }
  },
  filters: {
    moment: function(date) {
      return moment(date).format("DD MMMM YYYY");
    }
  },
  computed: {
    rows() {
      return this.infos.length;
    },
    paginatedItems() {
      return this.paginate(this.infos, +this.perPage, this.currentPage);
    }
  }
};
</script>

<style scoped>
.dot {
  height: 10px;
  width: 10px;
  background-color: #7ebe42;
  border-radius: 50%;
  display: inline-block;
}
.detail-info-image {
  padding: 0 22vw;
}
.info-birthday {
  position: relative;
  min-height: 50vh;
  background-size: cover;
}
.info-birthday-text {
  text-align: center;
  padding-top: 10vh;
  color: white;
}
@media (max-width: 700px) {
  .detail-info-image {
    padding: 0;
  }
}
</style>

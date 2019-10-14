<template>
  <b-container fluid class="container-app">
    <Header title="INFORMATION LIST"></Header>

    <b-row>
      <b-col cols="6" md="2" class="mt-2">
        <p>Number of items per page</p>
      </b-col>
      <b-col cols="6" md="1">
        <b-form-select v-model="perPage" :options="perPageOptions"></b-form-select>
      </b-col>
    </b-row>

    <div class="table-responsive" style="margin-top: 20px">
      <table class="table table-striped">
        <thead>
          <tr>
            <th v-for="field in informationFields" :key="field">{{field}}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(info,idx) in infos">
            <tr
              data-toggle="collapse"
              :key="info.id"
              :data-target="`#collapse${info.id}`"
              class="clickable"
              @click="showInfoDetail(info.id, idx)"
            >
              <td width="5%">
                <div style="text-align: right">
                  <span class="dot" v-if="info.new"></span>
                </div>
              </td>
              <td width="15%">{{info.type}}</td>
              <td>{{info.subject}}</td>
              <td>{{info.time}}</td>
              <td width="5%">
                <font-awesome-icon :icon="info.plus ? 'angle-down': 'angle-up'" />
              </td>
            </tr>
            <tr :key="info.id + 'collapse'" v-if="!info.plus">
              <td colspan="12">
                <div class="detail-info-image">
                  <img src="https://www.urbansplash.co.uk/images/placeholder-16-9.jpg" alt />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
  </b-container>
</template>

<script>
import { perPageOptions } from "@/utility/globalVar.js";

export default {
  data() {
    return {
      model: true,
      perPage: "10",
      perPageOptions,
      currentPage: 1,
      informationFields: ["", "Category", "Subject", "Date", ""],
      infos: [
        {
          id: "a",
          new: true,
          type: "GMF Product",
          subject: "Reset your account password",
          time: "13.52",
          plus: true
        }
      ]
    };
  },
  methods: {
    showInfoDetail(id, idx) {
      this.infos[idx].plus = !this.infos[idx].plus;
    }
  },
  computed: {
    rows() {
      return this.infos.length;
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
@media (max-width: 700px) {
  .detail-info-image {
    padding: 0;
  }
}
</style>

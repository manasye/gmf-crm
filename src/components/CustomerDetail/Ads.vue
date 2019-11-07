<template>
  <div>
    <h5>Active Ads</h5>
    <p class="mb-4" v-if="activeAds.length === 0">No active ads found</p>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="activeAds"
      responsive
      class="mb-5"
      v-if="activeAds.length > 0"
    >
      <template v-slot:cell(image)="data">
        <img :src="data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(action)="data">
        <b-button size="sm" variant="success" @click="removeFromActive(data.item)" v-if="isAdmin()"
          >Remove from active ads</b-button
        >
      </template>
    </b-table>

    <b-button
      variant="success"
      size="sm"
      class="float-right"
      @click="showModalAds = true"
      v-if="isAdmin()"
      >Create New Ad</b-button
    >
    <h5>Ads List</h5>

    <b-table style="margin-top: 20px;" striped hover :items="adList" responsive>
      <template v-slot:cell(image)="data">
        <img :src="data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(action)="data">
        <b-button size="sm" variant="success" @click="addToActive(data.item)" v-if="isAdmin()"
          >Add to active ads</b-button
        >
        &nbsp;&nbsp;
        <font-awesome-icon
          style="cursor: pointer;"
          icon="pen"
          @click="editAd(data.item)"
        ></font-awesome-icon>
        &nbsp;&nbsp;
        <font-awesome-icon
          style="cursor: pointer;"
          icon="trash"
          @click="removeAd(data.item)"
        ></font-awesome-icon>
      </template>
    </b-table>

    <b-modal v-model="showModalAds" centered title="Manage Ads" @ok="submitAd">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Subject</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.subject"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.image"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.permalink"></b-form-input>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { isAdmin } from "../../utility/func";

export default {
  mounted() {
    if (!this.$store.getters.walkthrough) {
      this.getAdList();
      this.getActiveAdList();
    }
  },
  data() {
    return {
      activeAds: [],
      adList: [],
      showModalAds: false,
      editedData: {
        subject: "",
        image: "",
        permalink: ""
      }
    };
  },
  methods: {
    addToActive(item) {
      axios
        .get(`/companyads/add/${item.ads_id}/${this.$route.params.id}`)
        .then(() => {
          this.getActiveAdList();
        })
        .catch(() => {});
    },
    editAd(item) {
      this.editedData = item;
      this.showModalAds = true;
    },
    removeFromActive(item) {
      axios
        .get(`/companyads/remove/${item.ads_id}/${this.$route.params.id}`)
        .then(() => {
          this.getActiveAdList();
        })
        .catch(() => {});
    },
    removeAd(item) {
      axios
        .get(`/ads/delete/${item.ads_id}`)
        .then(() => {
          this.getAdList();
        })
        .catch(() => {});
    },
    submitAd() {
      axios
        .post("/ads/create", this.editedData)
        .then(() => {
          this.getAdList();
        })
        .catch(() => {});
    },
    getAdList() {
      axios
        .get(`/ads/readinactive/${this.$route.params.id}`)
        .then(({ data }) => {
          this.adList = data.data.map(el => {
            let o = Object.assign({}, el);
            if (isAdmin()) o.action = "a";
            return o;
          });
        })
        .catch(() => {});
    },
    getActiveAdList() {
      axios
        .get(`/ads/read/${this.$route.params.id}`)
        .then(({ data }) => {
          this.activeAds = data.data.map(el => {
            let o = Object.assign({}, el);
            if (isAdmin()) o.action = "a";
            return o;
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
h5 {
  text-transform: uppercase;
  font-weight: bold;
}
img {
  max-width: 120px;
}
</style>

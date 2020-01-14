<template>
  <div>
    <h5>Active Ads</h5>

    <b-table
      style="margin-top: 20px;"
      striped
      hover
      :items="activeAds"
      responsive
      class="mb-5"
      show-empty
    >
      <template v-slot:cell(image)="data">
        <img :src="getBaseStorage() + data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(ads_interval)="data"> {{ data.value }} min(s) </template>
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

    <b-table style="margin-top: 20px;" striped hover :items="adList" responsive show-empty>
      <template v-slot:cell(image)="data">
        <img :src="getBaseStorage() + data.value" alt="" />
      </template>
      <template v-slot:cell(permalink)="data">
        <a :href="data.value">{{ data.value }}</a>
      </template>
      <template v-slot:cell(ads_interval)="data"> {{ data.value }} min(s) </template>
      <template v-slot:cell(action)="data">
        <b-button size="sm" variant="success" @click="addToActive(data.item)" v-if="isAdmin()"
          >Add to active ads</b-button
        >
        &nbsp;&nbsp;
        <font-awesome-icon style="cursor: pointer;" icon="pen" @click="editAd(data.item)" />
        &nbsp;&nbsp;
        <font-awesome-icon style="cursor: pointer;" icon="trash" @click="removeAd(data.item)" />
      </template>
    </b-table>

    <b-modal v-model="showModalAds" centered title="Manage Ads" @ok="submitAd">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Subject</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.subject" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file v-model="editedData.image" placeholder="Choose new image" accept="image/*" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.permalink" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Ads Interval (in minutes)</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.ads_interval" type="number" />
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { isAdmin } from "../../utility/func";
import swal from "sweetalert";

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
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
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
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    removeAd(item) {
      axios
        .get(`/ads/delete/${item.ads_id}`)
        .then(() => {
          this.getAdList();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    submitAd() {
      let formData = new FormData();
      formData.set("subject", this.editedData.subject);
      if (this.editedData.image instanceof File) formData.set("image", this.editedData.image);
      formData.set("permalink", this.editedData.permalink);
      formData.set("ads_interval", this.editedData.ads_interval);
      if (this.editedData.ads_id) formData.set("ads_id", this.editedData.ads_id);

      const url = this.editedData.ads_id ? "/ads/update" : "/ads/create";
      axios
        .post(url, formData)
        .then(() => {
          this.getAdList();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
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

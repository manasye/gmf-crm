<template>
  <div style="margin-top: 65px">
    <div class="add-service" v-if="isAdmin()">
      <b-row>
        <b-col cols="6"><p class="mb-0 mt-1">GMF Services</p></b-col>
        <b-col cols="6" style="text-align: right">
          <b-button
            variant="success"
            size="sm"
            @click="
              showModal = true;
              newMode = true;
            "
            >Add New Service</b-button
          >
        </b-col>
      </b-row>
    </div>

    <b-row
      v-for="(service, idx) in services"
      :key="service.name"
      no-gutters
      class="mb-md-4 service-card-wrapper"
      style=" "
    >
      <b-col cols="12" md="7" :order-md="idx % 2 === 0 ? '1' : '2'">
        <b-carousel controls indicators background="#ababab">
          <b-carousel-slide :img-src="service.large_image" :key="service.large_image">
            <h1>
              {{
                service.name
                  .split(" ")
                  .slice(0, -1)
                  .join(" ")
              }}
            </h1>
            <h2>{{ service.name.split(" ")[service.name.split(" ").length - 1] }}</h2>
            <b-button variant="primary" size="sm" class="mt-4">Explore</b-button>
            <br />
            <b-button
              variant="success"
              size="sm"
              class="mt-3"
              v-if="isAdmin()"
              @click="editService(service)"
              >Edit</b-button
            >
          </b-carousel-slide>
        </b-carousel>
      </b-col>

      <b-col cols="12" md="5" :order-md="idx % 2 !== 0 ? '1' : '2'">
        <div class="detail-service">
          <b-row class="mb-5">
            <b-col cols="6">
              <img :src="service.small_image1" alt />
            </b-col>
            <b-col cols="6">
              <img :src="service.small_image2" alt />
            </b-col>
          </b-row>
          <hr />
          <p>{{ service.detail }}</p>
          <hr />
        </div>
      </b-col>
    </b-row>

    <b-modal v-model="showModal" centered v-if="showModal" @ok="postService">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name"></b-form-input>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Detail</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-textarea v-model="editedData.detail" rows="3"></b-form-textarea>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Large Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.large_image"
            placeholder="Choose new image"
          ></b-form-file>
        </b-col>
        <b-col cols="4"> <label class="mt-2">First Small Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.small_image1"
            placeholder="Choose new image"
          ></b-form-file>
        </b-col>
        <b-col cols="4"> <label class="mt-2">Second Small Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.small_image2"
            placeholder="Choose new image"
          ></b-form-file> </b-col
      ></b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  mounted() {
    this.getServices();
  },
  data() {
    return {
      services: [],
      showModal: false,
      editedData: {
        name: "",
        detail: "",
        large_image: "",
        small_image1: "",
        small_image2: ""
      },
      newMode: false
    };
  },
  methods: {
    editService(service) {
      this.showModal = true;
      this.editedData = service;
      this.newMode = false;
    },
    postService() {
      const url = this.newMode ? "/service/create" : "/service/update";
      axios
        .post(url, { ...this.editedData, id: this.editedData.service_id })
        .then(res => {
          this.getServices();
        })
        .catch(() => {});
    },
    getServices() {
      axios
        .get("/service/read")
        .then(res => {
          this.services = res.data.data;
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="scss">
.img-service {
  background-size: cover;
  color: white;
  padding: 50px;
  height: 100%;
}
.detail-service {
  padding: 50px 30px;
  p {
    color: #016299;
  }
}
hr {
  border-top: 1px dotted #016299;
}
.add-service {
  padding: 15px 30px 12px;
}
.service-card-wrapper {
  border-bottom: 1px dotted #95999c;
  border-top: 1px dotted #95999c;
}
</style>

<style>
.carousel-caption {
  top: 10%;
  bottom: 0;
  text-align: left;
}
</style>

<template>
  <div
    style="margin-top: 65px"
    data-intro="You can view Garuda Maintenance Facility Client Services Ability"
  >
    <div class="add-service">
      <b-row>
        <b-col :cols="isAdmin() ? '10' : '12'">
          <Header
            title="GMF Services"
            :subtitle="
              isAdmin()
                ? 'Enter updated details of GMF AeroAsia services be displayed in customers account page'
                : 'List of GMF AeroAsia services'
            "
        /></b-col>
        <b-col cols="2" style="text-align: right" v-if="isAdmin()" align-self="center">
          <b-button
            variant="success"
            size="sm"
            @click="
              () => {
                showModal = true;
                newMode = true;
              }
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
      data-intro="Service"
    >
      <b-col cols="12" md="7" :order-md="idx % 2 === 0 ? '1' : '2'">
        <b-carousel controls indicators background="#ababab">
          <b-carousel-slide
            :img-src="getBaseStorage() + service.large_image"
            :key="service.large_image"
          >
            <h1>
              {{
                service.name
                  .split(" ")
                  .slice(0, -1)
                  .join(" ")
              }}
            </h1>
            <h2>{{ service.name.split(" ")[service.name.split(" ").length - 1] }}</h2>
            <b-button variant="primary" size="sm" class="mt-4" @click="explore(service.permalink)"
              >Explore</b-button
            >
            <br />
            <b-button
              variant="success"
              size="sm"
              class="mt-3"
              v-if="isAdmin()"
              @click="editService(service)"
              >Edit</b-button
            >
            <br />
            <b-button
              variant="danger"
              size="sm"
              class="mt-3"
              v-if="isAdmin()"
              @click="removeService(service)"
              >Delete</b-button
            >
          </b-carousel-slide>
        </b-carousel>
      </b-col>

      <b-col cols="12" md="5" :order-md="idx % 2 !== 0 ? '1' : '2'">
        <div class="detail-service">
          <b-row class="mb-5">
            <b-col cols="6">
              <img :src="getBaseStorage() + service.small_image1" alt />
            </b-col>
            <b-col cols="6">
              <img :src="getBaseStorage() + service.small_image2" alt />
            </b-col>
          </b-row>
          <hr />
          <p>{{ service.detail }}</p>
          <hr />
        </div>
      </b-col>
    </b-row>

    <b-modal v-model="showModal" centered v-if="showModal" @ok="postService" title="Manage Service">
      <b-row>
        <b-col cols="4"> <label class="mt-2">Name</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.name" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Detail</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-textarea v-model="editedData.detail" rows="3" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Permalink</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-input v-model="editedData.permalink" rows="3" />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Large Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.large_image"
            placeholder="Choose new image"
          />
        </b-col>
        <b-col cols="4"> <label class="mt-2">First Small Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.small_image1"
            placeholder="Choose new image"
          />
        </b-col>
        <b-col cols="4"> <label class="mt-2">Second Small Image</label></b-col>
        <b-col cols="8" class="mb-3">
          <b-form-file
            accept="image/*"
            v-model="editedData.small_image2"
            placeholder="Choose new image"
          /> </b-col
      ></b-row>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

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
          window.location.href = "/#/feedback-customer";
          this.$store.commit("changeWalkthrough", true);
        });
    } else {
      this.getServices();
    }
  },
  data() {
    return {
      services: [],
      showModal: false,
      editedData: {
        id: 1,
        name: "",
        detail: "",
        permalink: "",
        large_image: "",
        small_image1: "",
        small_image2: ""
      },
      newMode: false,
      completed: false
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
      let formData = new FormData();
      formData.set("name", this.editedData.name);
      formData.set("detail", this.editedData.detail);
      formData.set("permalink", this.editedData.permalink);
      if (this.editedData.large_image instanceof File)
        formData.set("large_image", this.editedData.large_image);
      if (this.editedData.small_image1 instanceof File)
        formData.set("small_image1", this.editedData.small_image1);
      if (this.editedData.small_image2 instanceof File)
        formData.set("small_image2", this.editedData.small_image2);
      formData.set("id", this.editedData.service_id);
      axios
        .post(url, formData)
        .then(() => {
          this.getServices();
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    },
    getServices() {
      axios
        .get("/service/read")
        .then(res => {
          this.services = res.data.data;
        })
        .catch(() => {});
    },
    removeService(service) {
      axios
        .get(`/service/delete/${service.service_id}`)
        .then(() => {
          swal("Success", "Service successfully deleted", "success");
          this.getServices();
        })
        .catch(() => {});
    },
    explore(link) {
      if (link) window.location = link;
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
  padding: 15px 30px 0;
}
.service-card-wrapper {
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

<template>
  <b-container fluid class="container-app">
    <Header title="NEW COMPLAINT" :breadcrumbs="breadcrumbs"></Header>
    <div class="feedback-wrapper">
      <p class="mb-2">Subject / Complaint</p>
      <b-form-input v-model="subject"></b-form-input>
      <p class="mb-2 mt-4">Department</p>
      <b-form-checkbox-group>
        <b-row>
          <b-col cols="6" md="3" class="mb-2" v-for="(service, idx) in services" :key="idx">
            <b-form-checkbox
              :id="service.name"
              :name="service.name"
              v-model="serviceSelected"
              :value="service.name"
              class="checkbox"
              >{{ service.name }}</b-form-checkbox
            >
          </b-col>
        </b-row>
      </b-form-checkbox-group>
      <p class="mb-2 mt-4">Description</p>
      <b-form-textarea v-model="description" rows="3" max-rows="6"></b-form-textarea>

      <b-form-file
        id="file-default"
        class="mb-2 mt-4 file-form"
        v-model="files"
        :file-name-formatter="formatNames"
      ></b-form-file>

      <br />
      <br />
      <div
        class="pt-0 pb-4"
        data-intro="You can submit your new complaint along with attachment (Max:50mb)"
      >
        <b-button variant="success" class="mb-2 custom-intro" @click="submitComplaint"
          >SUBMIT</b-button
        >
      </div>
    </div>
  </b-container>
</template>

<script>
import { departments } from "@/utility/globalVar";
import { shortenText } from "@/utility/func.js";
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
          window.location.href = "/#/feedback-nonproject";
          this.$store.commit("changeWalkthrough", true);
        });
    } else {
      departments().then(res => {
        this.services = res;
      });
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          text: "Complaint List",
          href: `/#/feedback-customer`
        },
        {
          text: "New Complaint",
          active: true
        }
      ],
      subject: null,
      services: [{ value: null, name: "Loading...", text: "Loading..." }],
      serviceSelected: null,
      description: null,
      files: null,
      completed: false
    };
  },
  methods: {
    formatNames(files) {
      if (files.length === 1) {
        return shortenText(files[0].name, 10);
      } else {
        return `${files.length} files selected`;
      }
    },
    submitComplaint() {
      let formData = new FormData();
      formData.set("subject", this.subject);
      formData.set("user_id", this.getUserId());
      formData.set("complaint", this.description);
      formData.set("service", this.serviceSelected.join(","));
      if (this.files) formData.set("file", this.files);

      axios
        .post("/complaint/create", formData)
        .then(() => {
          swal("Success!", "You have successfully submitted a complaint!", "success");
          this.$store.dispatch("goToPage", "/feedback-customer");
        })
        .catch(err => {
          swal("Error", err.response.data.message, "error");
        });
    }
  }
};
</script>

<style scoped>
.feedback-wrapper {
  border: 1px solid #949699;
  padding: 10px 30px;
  margin-top: 10px;
}
.file-form {
  width: 30%;
}
@media (max-width: 700px) {
  .file-form {
    width: 100%;
  }
}
</style>
